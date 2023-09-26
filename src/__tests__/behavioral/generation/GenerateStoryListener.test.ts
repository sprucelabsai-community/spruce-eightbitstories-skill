import { Skill } from '@sprucelabs/spruce-skill-utils'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import { PublicStory } from '../../../eightbitstories.types'
import StoryGenerator, {
	GenerateOptions,
} from '../../../generation/StoryGenerator'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class GenerateStoryListenerTest extends AbstractEightBitTest {
	private static skill: Skill

	private static familyMembers: string[]
	private static storyElements: string[]

	protected static async beforeEach() {
		await super.beforeEach()
		const { skill } = await this.bootSkill()
		this.skill = skill
		this.familyMembers = [generateId()]
		this.storyElements = [generateId()]
		this.dropInStubGenerator()
	}

	@test()
	protected static async canCreateGenerateStoryListener() {
		await this.emitGenerate()
	}

	@test()
	protected static async setsStoryGeneratorToContext() {
		const { generator } = this.skill.getContext()
		assert.isInstanceOf(generator, StoryGenerator)
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

	@test()
	protected static async listenerReturnsStoryReturnedFromGenerator() {
		const story = await this.emitGenerate()
		assert.isEqualDeep(story, StubGenerator.story)
	}

	private static async emitAndAssertExpectedGenerateOptions() {
		await this.emitGenerate()
		this.assertLastGenerateOptionsEqualExpected()
	}

	private static assertLastGenerateOptionsEqualExpected() {
		assert.isEqualDeep(StubGenerator.lastGenerateOptions, {
			familyMembers: this.familyMembers,
			storyElements: this.storyElements,
			personId: this.fakedPerson.id,
		})
	}

	private static dropInStubGenerator() {
		this.skill.updateContext('generator', new StubGenerator())
	}

	private static async emitGenerate() {
		const [{ story }] = await this.fakedClient.emitAndFlattenResponses(
			'eightbitstories.generate-story::v2023_09_05',
			{
				payload: {
					familyMembers: this.familyMembers,
					storyElements: this.storyElements,
				},
			}
		)

		return story
	}
}

class StubGenerator extends StoryGenerator {
	public static wasGenerateCalled: boolean = false
	public static lastGenerateOptions?: GenerateOptions
	public static story: PublicStory = {
		id: generateId(),
		dateGenerated: new Date().getTime(),
		body: generateId(),
	}
	public async generate(options: GenerateOptions) {
		StubGenerator.wasGenerateCalled = true
		StubGenerator.lastGenerateOptions = options
		return StubGenerator.story
	}
}
