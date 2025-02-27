import { Skill } from '@sprucelabs/spruce-skill-utils'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, assert, generateId } from '@sprucelabs/test-utils'
import StoryGenerator, {
    GenerateOptions,
    StoryGeneratorImpl,
} from '../../../generation/StoryGenerator'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
@suite()
export default class GenerateStoryListenerTest extends AbstractEightBitTest {
    private skill!: Skill

    private familyMembers!: string[]
    private storyElements!: string[]
    private originalGenerator!: StoryGenerator
    private currentChallenge!: string
    private storyHash!: string

    protected async beforeEach() {
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
    protected async canCreateGenerateStoryListener() {
        await this.emitGenerate()
    }

    @test()
    protected async setsStoryGeneratorToContext() {
        //@ts-ignore
        assert.isInstanceOf(this.originalGenerator, StoryGeneratorImpl)
    }

    @test()
    protected async callsGenerateOnTheStoryGenerator() {
        await this.emitGenerate()
        assert.isTrue(StubGenerator.wasGenerateCalled)
    }

    @test()
    protected async passesMembersAndElementsToGenerator() {
        await this.emitAndAssertExpectedGenerateOptions()

        this.familyMembers.push(generateId())
        this.storyElements.push(generateId())

        await this.emitAndAssertExpectedGenerateOptions()
    }

    private async emitAndAssertExpectedGenerateOptions() {
        await this.emitGenerate()
        this.assertLastGenerateOptionsEqualExpected()
    }

    private assertLastGenerateOptionsEqualExpected() {
        assert.isEqualDeep(StubGenerator.lastGenerateOptions, {
            familyMemberIds: this.familyMembers,
            storyElementIds: this.storyElements,
            personId: this.fakedPerson.id,
            currentChallenge: this.currentChallenge,
            storyHash: this.storyHash,
        })
    }

    private dropInStubGenerator() {
        this.originalGenerator = this.skill.getContext().generator
        this.skill.updateContext('generator', new StubGenerator())
    }

    private async emitGenerate() {
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
