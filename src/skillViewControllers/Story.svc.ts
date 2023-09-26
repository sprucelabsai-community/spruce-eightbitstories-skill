import {
	AbstractSkillViewController,
	SkillView,
} from '@sprucelabs/heartwood-view-controllers'

export default class StorySkillViewController extends AbstractSkillViewController {
	public static id = 'story'

	public render(): SkillView {
		return {
			layouts: [
				{
					cards: [],
				},
			],
		}
	}
}
