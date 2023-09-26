import { SimpleStoreFactory } from '@sprucelabs/data-stores'
import { assertOptions } from '@sprucelabs/schema'
import OpenAI from 'openai'
import {
	PublicFamilyMember,
	PublicMeta,
	PublicStory,
} from '../eightbitstories.types'
import SpruceError from '../errors/SpruceError'
import FamilyMembersStore from '../members/FamilyMembers.store'
import MetaStore from '../meta/Meta.store'
import StoriesStore from '../story/Stories.store'
import PromptGenerator from './PromptGenerator'
import { storyElements } from './storyElements'

export class StoryGeneratorImpl {
	protected openai: OpenAI
	private prompt: PromptGenerator
	private meta: MetaStore
	private familyMembers: FamilyMembersStore
	private stories: StoriesStore

	protected constructor(options: {
		meta: MetaStore
		familyMembers: FamilyMembersStore
		stories: StoriesStore
	}) {
		const { meta, familyMembers, stories } = options

		this.meta = meta
		this.familyMembers = familyMembers
		this.stories = stories
		this.openai = new OpenAI()
		this.prompt = PromptGenerator.Generator()
	}

	public static async Generator(options: {
		stores: SimpleStoreFactory
		Class?: typeof StoryGeneratorImpl
	}) {
		const { Class, stores } = assertOptions(options, ['stores'])

		const meta = await stores.getStore('meta')
		const familyMembers = await stores.getStore('familyMembers')
		const stories = await stores.getStore('stories')

		return new (Class ?? this)({
			meta,
			familyMembers,
			stories,
		})
	}

	public async generate(options: GenerateOptions): Promise<PublicStory> {
		const {
			personId,
			familyMemberIds: familyMemberIds,
			storyElementIds: storyElementIds,
		} = options

		const meta = await this.loadMeta(personId)
		const familyMembers = await this.loadFamilyMembers(familyMemberIds)

		const prompt = this.generatePrompt({ familyMembers, meta, storyElementIds })

		const response = await this.send(prompt)

		const created = await this.stories.createOne({
			body: response,
			dateGenerated: new Date().getTime(),
			source: {
				personId,
			},
		})

		return created
	}

	private generatePrompt(options: {
		familyMembers: PublicFamilyMember[]
		meta: PublicMeta
		storyElementIds: string[]
	}) {
		const { familyMembers, meta, storyElementIds } = options

		return this.prompt.generate({
			familyMembers,
			familyName: meta.name,
			familyValues: meta.values,
			storyElements: storyElements.filter((element) =>
				storyElementIds.includes(element.id)
			),
		})
	}

	private async loadFamilyMembers(familyMemberIds: string[]) {
		return await this.familyMembers.find({
			id: {
				$in: familyMemberIds,
			},
		})
	}

	private async loadMeta(personId: string) {
		const meta = await this.meta.findOne({
			//@ts-ignore
			'target.personId': personId,
		})

		if (!meta) {
			throw new SpruceError({
				code: 'META_NOT_FOUND',
			})
		}
		return meta
	}

	private async send(prompt: string) {
		const results = await this.openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: prompt,
				},
				{
					role: 'user',
					content: 'Please write a 10 minute bedtime story!',
				},
			],
		})

		return results.choices[0].message.content!
	}
}

export default interface StoryGenerator {
	generate(options: GenerateOptions): Promise<PublicStory>
}

export interface GenerateOptions {
	personId: string
	familyMemberIds: string[]
	storyElementIds: string[]
}
