import {
	AbstractSkillViewController,
	CardViewController,
	Router,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'

export default class GenerateSkillViewController extends AbstractSkillViewController {
	public static id = 'generate'
	protected cardVcs: CardViewController[] = []
	protected controlsVc: CardViewController
	private router!: Router

	public constructor(options: ViewControllerOptions) {
		super(options)

		this.controlsVc = this.ControlsVc()

		this.cardVcs = [
			this.Controller('card', {
				header: {
					title: 'Select your story elements',
				},
				id: 'elements',
			}),
			this.Controller('card', {
				header: {
					title: "Who will be in tonight's story?",
				},
				id: 'members',
			}),
			this.controlsVc,
		]
	}

	private ControlsVc(): CardViewController {
		return this.Controller('card', {
			id: 'controls',
			footer: {
				buttons: [
					{
						id: 'back',
						label: 'Back',
						onClick: this.handleClickBack.bind(this),
					},
					{
						id: 'generate',
						label: 'Write Story',
						type: 'primary',
					},
				],
			},
		})
	}

	private async handleClickBack() {
		await this.router.redirect('eightbitstories.root')
	}

	public async load(options: SkillViewControllerLoadOptions) {
		const { router } = options
		this.router = router
	}

	public render(): SkillView {
		return {
			layouts: [
				{
					cards: this.cardVcs.map((card) => card.render()),
				},
			],
		}
	}
}
