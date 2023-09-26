import { PublicStory } from '../eightbitstories.types'

export default class StoryGenerator {
	public async generate(options: GenerateOptions): Promise<PublicStory> {}
}

export interface GenerateOptions {
	personId: string
	familyMembers: string[]
	storyElements: string[]
}
