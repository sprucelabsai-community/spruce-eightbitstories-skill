import {
	AbstractSkillViewController,
	CardViewController,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'

export default class StorySkillViewController extends AbstractSkillViewController {
	public static id = 'story'
	protected cardVc: CardViewController

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.cardVc = this.Controller('card', {
			id: 'story',
			header: {
				title: 'Story of the night!',
			},
			body: {},
		})
	}

	public async load(options: SkillViewControllerLoadOptions<Args>) {
		const { router, args } = options
		const { story } = args
		this.cardVc.setIsBusy(true)
		try {
			const client = await this.connectToApi()
			const [{ body }] = await client.emitAndFlattenResponses(
				'eightbitstories.get-story::v2023_09_05',
				{
					target: {
						storyId: story,
					},
				}
			)

			this.cardVc.addSection({
				text: {
					content: body,
				},
			})

			this.cardVc.setIsBusy(false)
		} catch (err: any) {
			await this.alert({
				message: err.message ?? 'Could not load that story!',
			})
			await router.redirect('eightbitstories.root')
		}
	}

	public render(): SkillView {
		return {
			layouts: [
				{
					cards: [this.cardVc.render()],
				},
			],
		}
	}
}

interface Args {
	story: string
}
