import {
	AbstractSkillViewController,
	CardViewController,
	SkillView,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'

export default class RootSkillViewController extends AbstractSkillViewController {
	public static id = 'root'
	private cardVc: CardViewController

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.cardVc = this.Controller('card', {
			id: 'controls',
			header: {
				title: '8-bit Stories',
				image: 'https://sprucebot.ngrok.io/images/8bitstories.jpg',
			},
			body: {
				sections: [
					{
						buttons: [
							{
								id: 'members',
								label: 'Family Members',
							},
							{
								id: 'values',
								label: 'Family Values',
							},
							{
								id: 'generate',
								label: 'Generate Story',
								type: 'primary',
							},
						],
					},
				],
			},
		})
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
