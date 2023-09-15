import {
	AbstractViewController,
	Card,
	CardViewController,
	FormViewController,
	ViewControllerOptions,
	buildForm,
} from '@sprucelabs/heartwood-view-controllers'
import familyMemberSchema from '#spruce/schemas/eightbitstories/v2023_09_05/familyMember.schema'
import {
	FamilyMember,
	FamilyMemberSchema,
	PublicFamilyMember,
} from '../eightbitstories.types'

export default class FamilyMemberFormCardViewController extends AbstractViewController<Card> {
	public static id = 'family-member-form-card'
	private cardVc: CardViewController
	protected formVc: FormViewController<FamilyMemberSchema>
	private onCancelHandler: () => void | Promise<void>
	protected onAddHandler: OnAddHandler

	public constructor(
		options: ViewControllerOptions & FamilyMemberFormCardOptions
	) {
		super(options)

		const { onCancel, onAdd } = options

		this.onCancelHandler = onCancel
		this.onAddHandler = onAdd
		this.formVc = this.FormVc()
		this.cardVc = this.CardVc()
	}

	private CardVc(): CardViewController {
		return this.Controller('card', {
			header: {
				title: 'Add family member!',
			},
			body: {
				sections: [
					{
						form: this.formVc.render(),
					},
				],
			},
		})
	}

	private FormVc() {
		return this.Controller(
			'form',
			buildForm({
				id: 'family-member-form',
				schema: familyMemberSchema,
				onCancel: this.handleClickCancel.bind(this),
				onSubmit: this.handleSubmit.bind(this),
				sections: [
					{
						fields: [
							'name',
							{
								name: 'bio',
								renderAs: 'textarea',
							},
						],
					},
				],
			})
		)
	}

	private async handleSubmit() {
		this.formVc.setIsBusy(true)

		try {
			const client = await this.connectToApi()
			const [{ familyMember }] = await client.emitAndFlattenResponses(
				'eightbitstories.add-family-member::v2023_09_05',
				{
					payload: {
						familyMember: { ...(this.formVc.getValues() as FamilyMember) },
					},
				}
			)

			await this.onAddHandler(familyMember)
		} catch (err: any) {
			await this.alert({
				message: err.message ?? 'Oh no! I could not add your family member!',
			})
		}

		this.formVc.setIsBusy(false)
	}

	private async handleClickCancel() {
		await this.onCancelHandler()
	}

	public render() {
		return this.cardVc.render()
	}
}

export interface FamilyMemberFormCardOptions {
	onCancel: () => void | Promise<void>
	onAdd: OnAddHandler
}

type OnAddHandler = (member: PublicFamilyMember) => void | Promise<void>
