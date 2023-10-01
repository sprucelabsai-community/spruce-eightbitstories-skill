import {
	AbstractSkillViewController,
	CardViewController,
	Router,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'

export default class RootSkillViewController extends AbstractSkillViewController {
	public static id = 'root'
	protected cardVc: CardViewController
	private router!: Router

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.cardVc = this.CardVc()
	}

	public renderNavigation() {
		return null
	}

	private CardVc(): CardViewController {
		return this.Controller('card', {
			id: 'controls',
			header: {
				title: '8-bit Stories',
				image:
					'https://s3.amazonaws.com/storybook.sprucelabs.ai/8bitstories.jpg',
				subtitle: 'Bedtime stories for families who know their values!',
			},
			body: {
				sections: [
					{
						buttons: [
							{
								id: 'meta',
								label: 'Family Values',
								onClick: this.handleClickMeta.bind(this),
							},
							{
								id: 'members',
								label: 'Family Members',
								onClick: this.handleClickMembers.bind(this),
							},
							{
								id: 'generate',
								label: 'Write Story',
								type: 'primary',
								onClick: this.handleClickGenerate.bind(this),
							},
						],
					},
				],
			},
		})
	}

	private async handleClickGenerate() {
		await this.router.redirect('eightbitstories.generate')
	}

	public async load(
		options: SkillViewControllerLoadOptions<Record<string, any>>
	): Promise<void> {
		const { router } = options
		this.router = router
	}

	private async handleClickMeta() {
		await this.router.redirect('eightbitstories.meta')
	}

	private async handleClickMembers() {
		await this.router.redirect('eightbitstories.members')
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
