import { Skill } from '@sprucelabs/spruce-skill-utils'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import StoryGenerator, {
    GenerateOptions,
    StoryGeneratorImpl,
} from '../../../generation/StoryGenerator'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class GenerateStoryListenerTest extends AbstractEightBitTest {
    private static skill: Skill

    private static familyMembers: string[]
    private static storyElements: string[]
    private static originalGenerator: StoryGenerator
    private static currentChallenge: string
    private static storyHash: string

    protected static async beforeEach() {
        await super.beforeEach()
        const { skill } = await this.bootSkill()
        this.skill = skill
        this.familyMembers = [generateId()]
        this.storyElements = [generateId()]
        this.currentChallenge = generateId()
        this.storyHash = generateId()
        this.dropInStubGenerator()
    }

    @test()
    protected static async canCreateGenerateStoryListener() {
        await this.emitGenerate()
    }

    @test()
    protected static async setsStoryGeneratorToContext() {
        //@ts-ignore
        assert.isInstanceOf(this.originalGenerator, StoryGeneratorImpl)
    }

    @test()
    protected static async callsGenerateOnTheStoryGenerator() {
        await this.emitGenerate()
        assert.isTrue(StubGenerator.wasGenerateCalled)
    }

    @test()
    protected static async passesMembersAndElementsToGenerator() {
        await this.emitAndAssertExpectedGenerateOptions()

        this.familyMembers.push(generateId())
        this.storyElements.push(generateId())

        await this.emitAndAssertExpectedGenerateOptions()
    }

    private static async emitAndAssertExpectedGenerateOptions() {
        await this.emitGenerate()
        this.assertLastGenerateOptionsEqualExpected()
    }

    private static assertLastGenerateOptionsEqualExpected() {
        assert.isEqualDeep(StubGenerator.lastGenerateOptions, {
            familyMemberIds: this.familyMembers,
            storyElementIds: this.storyElements,
            personId: this.fakedPerson.id,
            currentChallenge: this.currentChallenge,
            storyHash: this.storyHash,
        })
    }

    private static dropInStubGenerator() {
        this.originalGenerator = this.skill.getContext().generator
        this.skill.updateContext('generator', new StubGenerator())
    }

    private static async emitGenerate() {
        await this.fakedClient.emitAndFlattenResponses(
            'eightbitstories.generate-story::v2023_09_05',
            {
                payload: {
                    familyMembers: this.familyMembers,
                    storyElements: this.storyElements,
                    currentChallenge: this.currentChallenge,
                    storyHash: this.storyHash,
                },
            }
        )
    }
}

class StubGenerator implements StoryGenerator {
    public static wasGenerateCalled = false
    public static lastGenerateOptions?: GenerateOptions
    public async generate(options: GenerateOptions) {
        StubGenerator.wasGenerateCalled = true
        StubGenerator.lastGenerateOptions = options
    }
}
