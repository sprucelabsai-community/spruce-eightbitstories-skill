import {
	AbstractSkillViewController,
	Button,
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
	private isLoggedIn = false

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
			body: this.renderBody(),
		})
	}

	private renderBody() {
		return {
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
						this.isLoggedIn
							? {
									id: 'feedback',
									label: 'Submit Feedback',
									onClick: this.handleClickFeedback.bind(this),
									type: 'secondary',
								}
							: null,
						{
							id: 'generate',
							label: 'Write Story',
							type: 'primary',
							onClick: this.handleClickGenerate.bind(this),
						},
					].filter((b) => !!b) as Button[],
				},
			],
		}
	}

	private async handleClickFeedback() {
		const vc = this.Controller('eightbitstories.feedback-card', {
			onSubmit: () => {
				return dlgVc.hide()
			},
		})
		const dlgVc = this.renderInDialog(vc.render())
	}

	private async handleClickGenerate() {
		await this.router.redirect('eightbitstories.generate')
	}

	public async load(
		options: SkillViewControllerLoadOptions<Record<string, any>>
	): Promise<void> {
		const { router, authenticator } = options
		this.router = router

		this.isLoggedIn = authenticator.isLoggedIn()

		if (this.isLoggedIn) {
			this.cardVc.setBody(this.renderBody())
		}
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
