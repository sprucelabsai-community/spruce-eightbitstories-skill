import {
	AbstractSkillViewController,
	Card,
	CardViewController,
	Router,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewController,
	ViewControllerOptions,
	splitCardsIntoLayouts,
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
						onClick: this.handleClickGenerate.bind(this),
					},
				],
			},
		})
	}

	private async handleClickGenerate() {
		this.controlsVc.setFooterIsBusy(true)

		try {
			const client = await this.connectToApi()
			await client.emitAndFlattenResponses(
				'eightbitstories.generate-story::v2023_09_05',
				{
					payload: {
						familyMembers: ['aoeu'],
						storyElements: ['aoeu'],
					},
				}
			)
		} catch (err: any) {
			await this.alert({
				message: err.message ?? 'Could not generate!!',
			})
		}

		this.controlsVc.setFooterIsBusy(false)
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
			layouts: splitCardsIntoLayouts(
				this.cardVcs.map((c) => c.render()),
				3
			),
		}
	}
}

export const storyElements: StoryElement[] = [
	{
		id: 'space',
		name: 'Space Adventure',
		description:
			'When telling us this story, make a portion of it take place in space. Incorporate accurate physics and touch on your latest understanding of the cosmos. Make an interesting fact about the universe a part of the story.',
	},
	{
		id: 'fantasyWorld',
		name: 'Fantasy World',
		description:
			"Take us to a totally new world where things work in counterintuitive ways. Blow us away at first. But, the more we learn, the more we realize that things aren't as magical as they seem. End with us returning home and being content with what we had all along.",
	},
	{
		id: 'mystery',
		name: 'Mystery Detective',
		description:
			"Let's go on a Sherlock Holmes style adventure. Get into a few clues, layout some suspects, and then ask us to guess who did it before the big reveal.",
	},
	{
		id: 'wontAlwaysWin',
		name: `You can't win every battle`,
		description: `We have to get used to the idea that we won't always win. Make the loss at the end unexpected and leave it there. We will discuss it as a family afterwards.`,
	},
	{
		id: 'practice',
		name: 'Practice & Discipline',
		description:
			'The saying is practice makes perfect, but it\'s better said, "You play how you practice.". Tell us a story about being disciplined and practicing while everyone around us is giving us excuses to slack off. Show how, when it comes time to perform, the people who slacked off don\'t get what they want, but find ways to excuse their shortfall.',
	},
	{
		id: 'fairiesAndElves',
		name: 'Fairy & Elf Lands',
		description:
			"Fairy dances, mischievous elves, magical gifts, oh my! Even though it's fantasy, lets keep somethings real. It is not often different species get along. Even in the same species, our ingroup/outgroup bias is strong. This story is more about the complexities of 2 species and cultures mashing than it is about the magic. It's not fair to ask fairies to change for humans or humans to change for fairies, after all.",
	},
	{
		id: 'discovery',
		name: 'Train to the unknown',
		description:
			"This is gonna be so much fun! But, getting on a train (or car for that matter) without knowing where it is going is wreckless and inviting a bad outcome. In this story, we have a blast, and for only a moment things get scary, but we realize we need to know what we want and wher're we're going before we get on the train.",
	},
	{
		id: 'dinosaurs',
		name: 'Dinosaurs',
		description:
			'This is a timetravel adventure! Back to the land of the dinosaurs! Incorporate your latest understanding of the prehistoric world and share at least one little known, counter to popular belief, fact about dinosaurs (like how a lot of them probably had feathers).',
	},
	{
		id: 'natureSpirits',
		name: 'Nature Spirits',
		description:
			"There are things that are worth believing, even if they're not true. Let's go on an adventure deep in the forest where we encounter some hardship. In our moment of desparation something unexplainable ",
	},
	{
		id: 'leadership',
		name: 'Leadership',
		description:
			"Let's take a page out of Patrick Lencioni's 5 Dysfunctions of a Team and tell a story about a team that is struggling. The leader is struggling to get the team to work together. The team is struggling to hold each other accountable. The team is struggling to focus on results. The team is struggling to be committed to the team's goals. The team is struggling to have healthy conflict. The team is struggling to be open to new ideas. The team is struggling to be humble. The team is struggling to be patient.",
	},
	{
		id: 'perserverance',
		name: 'Perseverance',
		description: '',
	},
	{
		id: 'herosJourney',
		name: `Hero's Journey`,
		description: '',
	},
	{
		id: 'heroinesJourney',
		name: `Heroine's Journey`,
		description: '',
	},
	{
		id: 'friendship',
		name: 'Friendship',
		description: '',
	},
	{
		id: 'family',
		name: 'Family',
		description: '',
	},
	{
		id: 'sports',
		name: 'Sports',
		description: '',
	},
	{
		id: 'robots',
		name: 'Robots',
		description: '',
	},
	{
		id: 'animals',
		name: 'Animals',
		description: '',
	},
	{
		id: 'deathAndGrief',
		name: 'Death & Grief',
		description: '',
	},
	{
		id: 'Historical',
		name: 'Historical',
		description: '',
	},
	{
		id: 'heratige',
		name: 'Heratige',
		description: '',
	},
	{
		id: 'slidingDoors',
		name: 'Sliding Doors',
		description: '',
	},
	{
		id: 'perspectiveShift',
		name: 'Perspective Shift',
		description: '',
	},
	{
		id: 'witchesAndWizards',
		name: 'Witches & Wizards',
		description: '',
	},
	{
		id: 'seasons',
		name: 'Seasons',
		description: '',
	},
]

const generateStoreSchema = buildSchema({
	id: 'generateStory',
	fields: {
		elements: {
			type: 'select',
			isArray: true,
			options: {
				choices: shuffleArray(storyElements).map((element) => ({
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

function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1)) // Random index from 0 to i
		;[array[i], array[j]] = [array[j], array[i]] // Swap elements
	}
	return array
}
