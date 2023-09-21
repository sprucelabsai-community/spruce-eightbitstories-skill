import {
	AbstractSkillViewController,
	Card,
	CardViewController,
	Router,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewController,
	ViewControllerOptions,
	buildSkillViewLayout,
} from '@sprucelabs/heartwood-view-controllers'
import { Schema, buildSchema } from '@sprucelabs/schema'
import {
	FormCardViewController,
	buildFormCard,
} from '@sprucelabs/spruce-form-utils'

export default class GenerateSkillViewController extends AbstractSkillViewController {
	public static id = 'generate'
	protected cardVcs: ViewController<Card>[] = []
	protected controlsVc: CardViewController
	private router!: Router
	protected elementsVc: FormGettingVc<GenerateStorySchema>
	protected membersVc: FormGettingVc<GenerateStorySchema>

	public constructor(options: ViewControllerOptions) {
		super(options)

		const views = this.getVcFactory()
		if (!views.hasController('forms.card')) {
			views.setController('forms.card', FormGettingVc)
		}

		this.controlsVc = this.ControlsVc()
		this.elementsVc = this.ElementsVc()
		this.membersVc = this.MembersVc()

		this.cardVcs = [this.elementsVc, this.membersVc, this.controlsVc]
	}

	public async getIsLoginRequired() {
		return true
	}

	private MembersVc() {
		return this.Controller(
			'forms.card',
			buildFormCard({
				header: {
					title: "Who will be in tonight's story?",
				},
				id: 'members',
				schema: generateStoreSchema,
				shouldShowSubmitControls: false,
				fields: [
					{
						name: 'members',
						renderAs: 'tags',
					},
				],
			})
		) as FormGettingVc<GenerateStorySchema>
	}

	private ElementsVc() {
		return this.Controller(
			'forms.card',
			buildFormCard({
				header: {
					title: 'Select your story elements',
				},
				id: 'elements',
				schema: generateStoreSchema,
				shouldShowSubmitControls: false,
				fields: [
					{
						name: 'elements',
						renderAs: 'tags',
					},
				],
			})
		) as FormGettingVc<GenerateStorySchema>
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

		const client = await this.connectToApi()
		const [{ familyMembers }] = await client.emitAndFlattenResponses(
			'eightbitstories.list-family-members::v2023_09_05'
		)

		const membersFormVc = this.membersVc.getFormVc()
		membersFormVc.updateField('members', {
			fieldDefinition: {
				type: 'select',
				isArray: true,
				options: {
					choices: familyMembers.map((member) => ({
						label: member.name,
						value: member.id,
					})),
				},
			},
		})

		membersFormVc.triggerRender()
	}

	public render(): SkillView {
		return {
			...buildSkillViewLayout('grid', {
				cards: this.cardVcs.map((card) => card.render()),
			}),
		}
	}
}

export const storyElements: StoryElement[] = [
	{
		id: 'sci-fi',
		name: 'Sci-Fi',
		description: 'A story set in the future, or involving advanced technology.',
	},
	{
		id: 'fantasy',
		name: 'Fantasy',
		description: 'A story set in a magical world.',
	},
]

const generateStoreSchema = buildSchema({
	id: 'generateStory',
	fields: {
		elements: {
			type: 'select',
			isArray: true,
			options: {
				choices: storyElements.map((element) => ({
					value: element.id,
					label: element.name,
				})),
			},
		},
		members: {
			type: 'select',
			isArray: true,
			options: {
				choices: [],
			},
		},
	},
})

export type GenerateStorySchema = typeof generateStoreSchema

interface StoryElement {
	id: string
	name: string
	description: string
}

class FormGettingVc<S extends Schema> extends FormCardViewController<S> {
	public getFormVc() {
		return this.formVc
	}
}
