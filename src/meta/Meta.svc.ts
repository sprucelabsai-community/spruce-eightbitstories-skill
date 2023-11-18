import {
	CardViewController,
	FormOnChangeOptions,
	FormViewController,
	Router,
	SkillView,
	SkillViewControllerLoadOptions,
	SpruceSchemas,
	ViewControllerOptions,
	buildForm,
} from '@sprucelabs/heartwood-view-controllers'
import metaSchema from '#spruce/schemas/eightbitstories/v2023_09_05/meta.schema'
import AbstractEightBitSkillView from '../skillViewControllers/AbstractEightBitSkillView'

export default class MetaSkillViewController extends AbstractEightBitSkillView {
	public static id = 'meta'
	protected cardVc: CardViewController
	protected formVc: FormViewController<MetaSchema>
	private router!: Router

	public constructor(options: ViewControllerOptions) {
		super(options)

		this.formVc = this.FormVc()
		this.cardVc = this.CardVc()
	}

	private FormVc(): FormViewController<MetaSchema> {
		return this.Controller(
			'form',
			buildForm({
				schema: metaSchema,
				onCancel: this.handleCancelForm.bind(this),
				onSubmit: this.handleSubmitForm.bind(this),
				onChange: this.handleChangeForm.bind(this),
				sections: [
					{
						fields: [
							{
								name: 'name',
								hint: 'You can use your last name or come up with something totally unique. This is how your family will be referred to in your stories.',
							},
							{
								name: 'values',
								renderAs: 'textarea',
								hint: 'Type in anything you want. It can be a bulleted list, a paragraph, or even a poem. These values will be incorporated into all your stories. If you are struggling here, checkout our 8-bit Facebook Group Tay started to discuss values with other families. 👇',
							},
						],
					},
				],
				footer: {
					buttons: [
						{
							id: 'facebookGroup',
							label: 'Join the Facebook Group',
							onClick: this.handleClickJoinFacebookGroup.bind(this),
						},
					],
				},
			})
		)
	}

	private CardVc(): CardViewController {
		return this.Controller('card', {
			header: {
				title: `Your Family`,
				image: 'https://s3.amazonaws.com/storybook.sprucelabs.ai/values.jpeg',
			},
			body: {
				isBusy: true,
				sections: [
					{
						form: this.formVc.render(),
					},
				],
			},
		})
	}

	private async handleClickJoinFacebookGroup() {
		await this.router.redirect(
			'https://www.facebook.com/groups/8bitstories' as any
		)
	}

	private async handleChangeForm(options: FormOnChangeOptions<MetaSchema>) {
		const { values } = options
		const title = values.name ? `The ${values.name} Family` : 'Your Family'
		this.cardVc.setHeaderTitle(title)
	}

	public async load(
		options: SkillViewControllerLoadOptions<Record<string, any>>
	): Promise<void> {
		const { router } = options
		this.router = router

		await this.loadMeta()

		this.cardVc.setIsBusy(false)
	}

	private async loadMeta() {
		const client = await this.connectToApi()
		const [{ meta }] = await client.emitAndFlattenResponses(
			'eightbitstories.get-meta::v2023_09_05'
		)

		if (meta) {
			await this.formVc.setValues(meta)
		}
	}

	private async handleSubmitForm() {
		this.formVc.setIsBusy(true)
		try {
			await this.emitSave()
			await this.redirectToRoot()
		} catch (err: any) {
			this.alert({
				message: err.message ?? 'Failed to save your family details!',
			})
		}
		this.formVc.setIsBusy(false)
	}

	private async emitSave() {
		const client = await this.connectToApi()
		const { name, values } = this.formVc.getValues()
		await client.emitAndFlattenResponses(
			'eightbitstories.save-meta::v2023_09_05',
			{
				payload: {
					meta: {
						name: name!,
						values: values!,
					},
				},
			}
		)
	}

	private async handleCancelForm() {
		await this.redirectToRoot()
	}

	private async redirectToRoot() {
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

export type MetaSchema = SpruceSchemas.Eightbitstories.v2023_09_05.MetaSchema
