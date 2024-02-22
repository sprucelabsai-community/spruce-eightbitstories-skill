import {
	Card,
	CardViewController,
	Router,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewController,
	ViewControllerOptions,
	buildSkillViewLayout,
} from '@sprucelabs/heartwood-view-controllers'
import { MercuryClient } from '@sprucelabs/mercury-client'
import { buildSchema } from '@sprucelabs/schema'
import { buildFormCard } from '@sprucelabs/spruce-form-utils'
import AbstractLoggedInEightBitSkillView from '../skillViewControllers/AbstractLoggedInEightBitSkillView'
import FormGettingVc from './FormGettingVc'
import { storyElements } from './storyElements'

export default class GenerateSkillViewController extends AbstractLoggedInEightBitSkillView {
	public static id = 'generate'
	protected cardVcs: ViewController<Card>[] = []
	protected controlsVc: CardViewController
	private router!: Router
	protected elementsVc: FormGettingVc<GenerateStorySchema>
	protected membersVc: FormGettingVc<GenerateStorySchema>
	private client!: MercuryClient
	protected currentChallengeVc: FormGettingVc<CurrentChallengeSchema>

	public constructor(options: ViewControllerOptions) {
		super(options)

		const views = this.getVcFactory()
		if (!views.hasController('forms.card')) {
			views.setController('forms.card', FormGettingVc)
		}

		this.controlsVc = this.ControlsVc()
		this.elementsVc = this.ElementsVc()
		this.membersVc = this.MembersVc()
		this.currentChallengeVc = this.CurrentChallengeVc()

		this.cardVcs = [
			this.elementsVc,
			this.membersVc,
			this.currentChallengeVc,
			this.controlsVc,
		]
	}

	private CurrentChallengeVc() {
		return this.Controller(
			'forms.card',
			buildFormCard({
				id: 'currentChallenge',
				header: {
					title: 'Current Challenge',
					subtitle: `Have something you want to focus on for this story? Describe it below and I'll work it into tonight's story!`,
				},
				schema: currentChallengeSchema,
				fields: [
					{
						name: 'currentChallenge',
						renderAs: 'textarea',
						label: 'Current Challenge',
					},
				],
				shouldShowSubmitControls: false,
			})
		) as FormGettingVc<CurrentChallengeSchema>
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
						onClick: this.handleClickGenerate.bind(this),
					},
				],
			},
		})
	}

	private async handleClickGenerate() {
		this.controlsVc.setFooterIsBusy(true)

		try {
			const members = this.membersVc.getValue('members') as string[]
			const elements = this.elementsVc.getValue('elements') as string[]
			const currentChallenge = this.currentChallengeVc.getValue(
				'currentChallenge'
			) as string

			const client = await this.connectToApi()
			await client.emitAndFlattenResponses(
				'eightbitstories.generate-story::v2023_09_05',
				{
					payload: {
						familyMembers: members,
						storyElements: elements,
						currentChallenge,
					},
				}
			)
			await this.alert({
				style: 'info',
				message:
					"I'm writing your story now! It can take up to a minute, so hang tight!",
			})
		} catch (err: any) {
			await this.alert({
				message: err.message ?? 'Could not generate!!',
			})
			this.controlsVc.setFooterIsBusy(false)
		}
	}

	private async handleClickBack() {
		await this.router.redirect('eightbitstories.root')
	}

	public async load(options: SkillViewControllerLoadOptions) {
		const { router } = options
		this.router = router
		this.client = await this.connectToApi()

		await this.setupDidGenerateListener()
		await this.loadFamilyMembers()
	}

	public async destroy(): Promise<void> {
		await this.client.off('eightbitstories.did-generate-story::v2023_09_05')
	}

	private async setupDidGenerateListener() {
		const client = await this.connectToApi()

		await client.on(
			'eightbitstories.did-generate-story::v2023_09_05',
			({ payload }) => {
				const { storyId } = payload
				void this.router.redirect('eightbitstories.story', {
					story: storyId,
				})
			}
		)
	}

	private async loadFamilyMembers() {
		const client = await this.connectToApi()
		const [{ familyMembers }] = await client.emitAndFlattenResponses(
			'eightbitstories.list-family-members::v2023_09_05'
		)

		if (!familyMembers.length) {
			await this.alert({
				message: 'You gotta add your family before you can generate a story!!',
			})

			await this.router.redirect('eightbitstories.root')

			return
		}

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
		const skillView = buildSkillViewLayout('big-left', {
			leftCards: [this.elementsVc.render(), this.membersVc.render()],
			rightCards: [this.currentChallengeVc.render(), this.controlsVc.render()],
		})
		return {
			...skillView,
		}
	}
}

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

const currentChallengeSchema = buildSchema({
	id: 'currentChallenge',
	fields: {
		currentChallenge: {
			type: 'text',
		},
	},
})

export type CurrentChallengeSchema = typeof currentChallengeSchema
