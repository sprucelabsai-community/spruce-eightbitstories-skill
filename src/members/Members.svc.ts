import {
	AbstractSkillViewController,
	CardViewController,
	ListViewController,
	Router,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'

export default class MembersSkillViewController extends AbstractSkillViewController {
	public static id = 'members'
	protected cardVc: CardViewController
	protected listVc: ListViewController
	private router!: Router

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.listVc = this.ListVc()
		this.cardVc = this.CardVc()
	}

	private ListVc(): ListViewController {
		return this.Controller('list', {
			rows: [
				{
					id: 'no-results',
					height: 'content',
					cells: [
						{
							text: {
								content: 'No family members found!',
							},
							subText: {
								content: `I'm ready for you to start adding your family members!`,
							},
						},
					],
				},
			],
		})
	}

	private CardVc(): CardViewController {
		return this.Controller('card', {
			header: {
				title: 'Family Members',
				image: 'https://storybook.spruce.bot/images/8bit/members.jpg',
			},
			body: {
				sections: [
					{
						list: this.listVc.render(),
					},
				],
			},
			footer: {
				buttons: [
					{
						id: 'back',
						label: 'Back',
						onClick: this.handleClickBack.bind(this),
					},
					{
						id: 'add',
						label: 'Add Family Member',
						type: 'primary',
						onClick: this.handleRenderClickAdd.bind(this),
					},
				],
			},
		})
	}

	private async handleRenderClickAdd() {
		const vc = this.Controller('eightbitstories.family-member-form-card', {
			onCancel: async () => dlgVc.hide(),
			onAdd: async () => dlgVc.hide(),
		})
		const dlgVc = this.renderInDialog(vc.render())
	}

	public async load(options: SkillViewControllerLoadOptions) {
		const { router } = options
		this.router = router
	}

	private async handleClickBack() {
		await this.router.redirect('eightbitstories.root')
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
