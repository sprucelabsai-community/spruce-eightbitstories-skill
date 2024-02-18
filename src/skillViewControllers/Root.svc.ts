import {
	Button,
	CardViewController,
	Router,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import AbstractEightBitSkillView from './AbstractEightBitSkillView'

export default class RootSkillViewController extends AbstractEightBitSkillView {
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

	public async getIsLoginRequired() {
		return this.onboarding.isOnboarding
	}

	private CardVc(): CardViewController {
		return this.Controller('card', {
			id: 'controls',
			header: {
				title: '8-bit Stories',
				image:
					'https://s3.amazonaws.com/storybook.sprucelabs.ai/8bitstories.jpg',
				subtitle: 'Bedtime stories about your family on epic adventures!',
			},
			body: this.renderBody(),
		})
	}

	private renderBody(shouldRenderFeedbackButton = false) {
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
						shouldRenderFeedbackButton && {
							id: 'feedback',
							label: 'Submit Feedback',
							onClick: this.handleClickFeedback.bind(this),
							type: 'secondary',
						},
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
		const isLoggedIn = authenticator.isLoggedIn()

		if (
			!this.onboarding.didSkipOnboarding &&
			!isLoggedIn &&
			!this.onboarding.isOnboarding
		) {
			await this.router.redirect('eightbitstories.onboarding')
			return
		}

		if (!this.onboarding.didSkipOnboarding && this.onboarding.isOnboarding) {
			await this.remote.saveMeta({
				name: this.onboarding.name!,
				values: this.onboarding.values!,
			})

			this.onboarding.reset()

			await this.router.redirect('eightbitstories.members')

			return
		}

		if (isLoggedIn) {
			this.cardVc.setBody(this.renderBody(true))
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
