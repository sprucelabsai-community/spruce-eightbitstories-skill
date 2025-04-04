import { eventFaker, fake, seed } from '@sprucelabs/spruce-test-fixtures'
import {
    test,
    suite,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import OpenAI from 'openai'
import {
    ChatCompletion,
    ChatCompletionCreateParamsBase,
} from 'openai/resources/chat/completions'
import { PublicMeta, StoryElement } from '../../../eightbitstories.types'
import PromptGenerator from '../../../generation/PromptGenerator'
import { storyElements } from '../../../generation/storyElements'
import { StoryGeneratorImpl } from '../../../generation/StoryGenerator'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import { DidGenerateTargetAndPayload } from '../../support/EventFaker'

@fake.login()
@suite()
export default class StoryGeneratorTest extends AbstractEightBitTest {
    private generator!: SpyGenerator
    private passedOptions!: ChatCompletionCreateParamsBase | undefined
    private prompt!: PromptGenerator
    private responseBody = generateId()
    private storyHash!: string

    protected async beforeEach() {
        await super.beforeEach()

        this.generator = (await StoryGeneratorImpl.Generator({
            stores: this.stores,
            Class: SpyGenerator,
            client: this.fakedClient,
        })) as SpyGenerator

        await eventFaker.handleReactiveEvent(
            'eightbitstories.did-generate-story::v2023_09_05'
        )

        this.storyHash = generateId()
        this.passedOptions = undefined
        this.prompt = PromptGenerator.Generator()

        const choice: ChatCompletion.Choice = {
            finish_reason: 'stop',
            logprobs: null,
            index: 0,
            message: {
                content: this.responseBody,
                role: 'assistant',
                refusal: null,
            },
        }

        //@ts-ignore
        this.generator.openai.chat.completions.create = (
            options: ChatCompletionCreateParamsBase
        ) => {
            this.passedOptions = options
            return {
                choices: [choice],
                controller: {},
                id: 'aoeu',
            }
        }
    }

    @test()
    protected async throwsWithMissing() {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            StoryGeneratorImpl.Generator()
        )
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['stores', 'client'],
        })
    }

    @test()
    protected async setsOpenAiOnClass() {
        assert.isInstanceOf(this.generator.getApi(), OpenAI)
    }

    @test()
    @seed('meta')
    protected async generateReachesOutToOpenAi() {
        await this.generate()

        const messages = this.passedOptions?.messages

        assert.isTruthy(this.passedOptions)
        assert.isEqual(this.passedOptions?.model, 'gpt-4o')
        assert.isLength(messages, 2)

        const firstMessage = messages?.[0]
        assert.isEqual(firstMessage?.role, 'system')

        const secondMessage = messages?.[1]
        assert.isEqual(secondMessage?.role, 'user')
        assert.isEqual(
            secondMessage?.content,
            `Please write a 10 minute bedtime story!`
        )
    }

    @test()
    @seed('familyMembers', 3)
    @seed('meta')
    protected async passesExpectedPromptAsSystemMessage() {
        await this.assertSendsExpectedPrompt()
    }

    @test()
    @seed('familyMembers', 1)
    @seed('meta')
    protected async filtersMetaByPerson() {
        //@ts-ignore
        await this.metas.update({}, { 'target.personId': generateId() })
        const meta = await this.metas.createOne({
            name: generateId(),
            values: generateId(),
            target: {
                personId: this.fakedPerson.id,
            },
        })

        await this.assertSendsExpectedPrompt({
            meta,
        })
    }

    @test()
    @seed('familyMembers', 5)
    @seed('meta')
    protected async onlyLoadsPassedMembers() {
        const members = await this.members.find({})
        const ids = [members[0].id, members[3].id]

        await this.assertSendsExpectedPrompt({
            familyMemberIds: ids,
        })
    }

    @test()
    @seed('familyMembers', 5)
    @seed('meta')
    protected async usesPassedStoryElements() {
        await this.assertSendsExpectedPrompt({
            storeElementIds: [storyElements[1].id, storyElements[2].id],
        })
    }

    @test()
    protected async throwsErrorIfNoMetaFound() {
        const err = await assert.doesThrowAsync(() => this.generate())
        errorAssert.assertError(err, 'META_NOT_FOUND')
    }

    @test()
    @seed('familyMembers', 5)
    @seed('meta')
    protected async writesStoreRecord() {
        await this.generate()

        const count = await this.stories.count()
        assert.isEqual(count, 1)
    }

    @test()
    @seed('familyMembers', 5)
    @seed('meta')
    protected async writesStoreRecordWithExpectedValues() {
        const dateCreatedFloor = new Date().getTime()
        await this.wait(1)

        await this.generate()
        const story = await this.getGeneratedStory()
        assert.isEqual(story.source.personId, this.fakedPerson.id)

        const dateCreatedCeiling = new Date().getTime()

        assert.isBetweenInclusive(
            story.dateGenerated,
            dateCreatedFloor,
            dateCreatedCeiling
        )

        assert.isEqual(story.body, this.responseBody)
    }

    @test()
    @seed('familyMembers', 5)
    @seed('meta')
    protected async emitsDidGenerateAfterGenerating() {
        let passedTarget: DidGenerateTargetAndPayload['target'] | undefined
        let passedPayload: DidGenerateTargetAndPayload['payload'] | undefined

        await this.eventFaker.fakeDidGenerateStory(({ target, payload }) => {
            passedTarget = target
            passedPayload = payload
        })

        await this.generate()

        assert.isEqualDeep(passedTarget, {
            personId: this.fakedPerson.id,
        })

        const story = await this.getFirstGeneratedStory()

        assert.isEqualDeep(passedPayload, {
            storyId: story.id,
        })
    }

    @test()
    @seed('familyMembers', 1)
    @seed('meta')
    protected async passesThroughHash() {
        await this.generate()
        const story = await this.getFirstGeneratedStory()
        assert.isEqual(story.source.hash, this.storyHash, 'Hash did not match!')
    }

    @test()
    @seed('meta')
    protected async passesCurrentChallengeToPromptGenerator() {
        await this.assertSendsExpectedPrompt({
            storeElementIds: [storyElements[1].id, storyElements[2].id],
            currentChallenge: generateId(),
        })
    }

    private async getGeneratedStory() {
        const match = await this.stories.findOne(
            {},
            { shouldIncludePrivateFields: true }
        )
        assert.isTruthy(match)
        return match
    }

    private async assertSendsExpectedPrompt(options?: {
        meta?: PublicMeta
        familyMemberIds?: string[]
        storeElementIds?: string[]
        currentChallenge?: string
    }) {
        const {
            meta: metaOptions,
            familyMemberIds: familyMemberIds,
            storeElementIds,
            currentChallenge,
        } = options ?? {}

        const meta = metaOptions ?? (await this.metas.findOne({}))
        assert.isTruthy(meta)

        const members = await this.loadFamilyMembers(familyMemberIds)
        const expected = this.prompt.generate({
            familyMembers: members,
            familyName: meta.name,
            familyValues: meta.values,
            storyElements: this.getStoryElementIds(storeElementIds),
            currentChallenge,
        })

        await this.generate({
            familyMemberIds,
            storeElementIds,
            currentChallenge,
        })

        assert.isEqual(this.passedOptions?.messages[0]?.content, expected)
    }

    private getStoryElementIds(ids?: string[]): StoryElement[] {
        if (ids) {
            return storyElements.filter((e) => ids.includes(e.id))
        }

        return [storyElements[0]]
    }

    private async loadFamilyMembers(familyMemberIds: string[] | undefined) {
        let membersQuery = {}
        if (familyMemberIds) {
            membersQuery = {
                id: {
                    $in: familyMemberIds,
                },
            }
        }
        const members = await this.members.find(membersQuery)
        return members
    }

    private async generate(options?: {
        familyMemberIds?: string[]
        storeElementIds?: string[]
        currentChallenge?: string
    }) {
        const {
            familyMemberIds: familyMemberIds,
            storeElementIds,
            currentChallenge,
        } = options ?? {}

        const members = await this.loadFamilyMembers(familyMemberIds)

        return await this.generator.generate({
            familyMemberIds: members.map((m) => m.id),
            personId: this.fakedPerson.id,
            storyElementIds: storeElementIds ?? [storyElements[0].id],
            currentChallenge,
            storyHash: this.storyHash,
        })
    }
}

class SpyGenerator extends StoryGeneratorImpl {
    public getApi() {
        return this.openai
    }
}
