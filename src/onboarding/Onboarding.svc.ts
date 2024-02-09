import {
	AbstractSkillViewController,
	ViewControllerOptions,
	SkillView,
	SwipeCardViewController,
	CardSection,
	buildForm,
	FormViewController,
	Button,
	SkillViewControllerLoadOptions,
	Router,
} from '@sprucelabs/heartwood-view-controllers'
import { buildSchema } from '@sprucelabs/schema'
import Onboarding from './Onboarding'

export default class OnboardingSkillViewController extends AbstractSkillViewController {
	public static id = 'onboarding'
	protected swipeVc: SwipeCardViewController
	private titles = {
		intro: 'Unlimited Personalized Bedtime Stories',
		name: 'Family Name',
		values: 'Family Values',
		members: 'Family Members',
	}

	private images = {
		name: 'https://s3.amazonaws.com/storybook.sprucelabs.ai/onboarding-boat.jpg',
		values: 'https://s3.amazonaws.com/storybook.sprucelabs.ai/snow.jpg',
		members: 'https://s3.amazonaws.com/storybook.sprucelabs.ai/theme-park.jpg',
	}

	protected nameFormVc: FormViewController<NameFormSchema>
	protected valuesFormVc: FormViewController<ValuesFormSchema>
	private router!: Router

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.nameFormVc = this.NameFormVc()
		this.valuesFormVc = this.ValuesFormVc()
		this.swipeVc = this.SwipeVc()
	}

	private ValuesFormVc(): FormViewController<ValuesFormSchema> {
		return this.Controller(
			'form',
			buildForm({
				id: 'values',
				schema: valuesFormSchema,
				shouldShowSubmitControls: false,
				onChange: this.updateFooter.bind(this),
				sections: [
					{
						text: {
							html: '<p>Woohoo! 🙌 You are well on your way to a new kind of bedtime story!</p><p>Next up are your family values!</p><p>So, what are the values that are important to your family? These will be used to help craft meaninful and inspiring stories.</p>',
						},
					},
					{
						fields: [{ name: 'values', renderAs: 'textarea' }],
					},
				],
			})
		)
	}

	private NameFormVc(): FormViewController<NameFormSchema> {
		return this.Controller(
			'form',
			buildForm({
				id: 'name',
				schema: nameFormSchema,
				shouldShowSubmitControls: false,
				onChange: this.handleNameChange.bind(this),
				onSubmit: this.handleClickNext.bind(this),
				sections: [
					{
						text: {
							content:
								"Let's get started customizing your bedtime stories! It's very important that everyone is under the same name! We used our last name 'Romero', but you could really use anything you want, as long as it brings everyone together under the same banner!",
						},
					},
					{
						fields: ['name'],
					},
				],
			})
		)
	}

	private handleNameChange() {
		const name = this.nameFormVc.getValue('name')
		const title = name ? `The ${name}s` : 'Family Name'

		this.swipeVc.setHeaderTitle(title)
		this.updateFooter()
	}

	private updateFooter() {
		this.swipeVc.setFooter(this.renderFooter())
	}

	private SwipeVc(): SwipeCardViewController {
		return this.Controller('swipe-card', {
			header: this.renderHeader(),
			onSlideChange: this.handleSlideChange.bind(this),
			slides: [
				this.renderIntroSlide(),
				this.renderNameSlide(),
				this.renderValuesSlide(),
				this.renderMembersSlide(),
			],
			footer: this.renderFooter(),
		})
	}

	private renderFooter() {
		const idx = this.swipeVc?.getPresentSlide() ?? 0
		return {
			buttons: [
				idx > 0
					? {
							id: 'back',
							label: 'Back',
							onClick: this.handleClickBack.bind(this),
						}
					: null,
				this.renderNextButton(),
			].filter((b) => b) as Button[],
		}
	}

	private async handleClickBack() {
		await this.jumpToSlide(-1)
	}

	private renderNextButton(): Button {
		let isEnabled = true
		const currentSlide = this.swipeVc?.getPresentSlideId() ?? 'intro'

		if (currentSlide === 'name' && !this.nameFormVc.isValid()) {
			isEnabled = false
		} else if (currentSlide === 'values' && !this.valuesFormVc.isValid()) {
			isEnabled = false
		}

		return {
			id: 'next',
			type: 'primary',
			label: 'Next',
			isEnabled,
			onClick: this.handleClickNext.bind(this),
		}
	}

	public async load(
		options: SkillViewControllerLoadOptions<Record<string, any>>
	): Promise<void> {
		const { router } = options
		this.router = router
	}

	private async handleClickNext() {
		if (this.getPresentSlideId() === 'members') {
			await this.router.redirect('eightbitstories.root')
			return
		}

		const name = this.nameFormVc.getValue('name')
		const values = this.valuesFormVc.getValue('values')

		if (name && !values) {
			await this.valuesFormVc.setValue(
				'values',
				`A ${name} always tries their best.\nA ${name} never gives up, but knows when to pivot.\nA ${name} makes sure everyone is safe, starting with family.`
			)
		}

		const onboarding = Onboarding.getInstance()
		onboarding.set({
			name,
			values,
		})

		await this.jumpToSlide(1)
	}

	private async jumpToSlide(direction: number) {
		await this.swipeVc.jumpToSlide(this.swipeVc.getPresentSlide() + direction)
	}

	private async handleSlideChange() {
		this.updateHeader()
		this.updateFooter()
	}

	private updateHeader() {
		const header = this.renderHeader()
		//@ts-ignore
		this.swipeVc.setHeader(header)
	}

	private renderHeader() {
		const slide = this.getPresentSlideId()
		//@ts-ignore
		const title = this.titles[slide]
		//@ts-ignore
		const image = this.images[slide] ?? null

		const header = {
			title,
			image,
		}
		return header
	}

	private getPresentSlideId() {
		return this.swipeVc?.getPresentSlideId() ?? 'intro'
	}

	private renderMembersSlide(): CardSection {
		return {
			id: 'members',
			text: {
				html: "<p>It's my favorite part! It's time to enter your family members!</p><p>But, before we get started, I ask that you secure your data by logging in.</p><p>After logging in, you'll be asked for a trial. Please give it a try and if there is anything you can think of make 8-bit Stories better, there is a button to message me directly in the app!</p><p>See you on the other side! ✌️</p>",
			},
		}
	}

	private renderValuesSlide(shouldRenderClearButton = true): CardSection {
		return {
			id: 'values',
			form: this.valuesFormVc.render(),
			buttons: shouldRenderClearButton
				? [
						{
							id: 'clear',
							label: 'Clear Values',
							onClick: this.handleClickClear.bind(this),
						},
					]
				: null,
		}
	}

	private async handleClickClear() {
		await this.valuesFormVc.setValue('values', null)
		this.swipeVc.updateSlide('values', this.renderValuesSlide(false))
		this.updateFooter()
	}

	private renderNameSlide(): CardSection {
		return {
			id: 'name',
			form: this.nameFormVc.render(),
		}
	}

	private renderIntroSlide(): CardSection {
		return {
			id: 'intro',
			shouldBePadded: false,
			text: {
				html: INTRO,
			},
		}
	}

	public renderNavigation() {
		return null
	}

	public render(): SkillView {
		return {
			layouts: [
				{
					cards: [this.swipeVc.render()],
				},
			],
		}
	}
}

const INTRO = `<iframe width="100%" height="300" src="https://www.youtube.com/embed/MQAs8SOGoxE?si=ZiecE6sSFNX_IURw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<hr />
<div style="padding:20px">
<p>Hey, I’m Tay! 👋</p>
<p>I built 8-bit Stories because I wanted better bedtime stories!</p>
<p>I wanted them to include my girls!</p>
<p>I wanted them to teach lessons based on things our family thinks are important.</p>
<p>I even wanted the stories to include challenges we were facing in life to help spark conversations.</p>
<p>After talking to other parents, I learned that I’m not alone!</p>
<p>Ok, enough about me, it’s time to make this about you!!</p>
</div>`

const nameFormSchema = buildSchema({
	id: 'nameForm',
	fields: {
		name: {
			type: 'text',
			isRequired: true,
			label: "What is your family's name?",
		},
	},
})

export type NameFormSchema = typeof nameFormSchema

const valuesFormSchema = buildSchema({
	id: 'valuesForm',
	fields: {
		values: {
			type: 'text',
			isRequired: true,
			label: 'I dropped in some values to get you started 👇',
		},
	},
})

export type ValuesFormSchema = typeof valuesFormSchema
