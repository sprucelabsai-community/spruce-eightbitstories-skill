import {
    ViewControllerOptions,
    SkillView,
    SwipeCardViewController,
    CardSection,
    buildForm,
    FormViewController,
    Button,
    SkillViewControllerLoadOptions,
    Router,
    CardFooter,
} from '@sprucelabs/heartwood-view-controllers'
import { buildSchema } from '@sprucelabs/schema'
import AbstractEightBitSkillView from '../skillViewControllers/AbstractEightBitSkillView'

export default class OnboardingSkillViewController extends AbstractEightBitSkillView {
    public static id = 'onboarding'
    protected swipeVc: SwipeCardViewController
    private titles: Record<SLIDE, string> = {
        intro: 'Unlimited Personalized Bedtime Stories',
        name: 'Family Name',
        values: 'Family Values',
        members: 'Family Members',
    }

    private images: Partial<Record<SLIDE, string>> = {
        name: 'https://s3.amazonaws.com/storybook.sprucelabs.ai/onboarding-boat.jpg',
        values: 'https://s3.amazonaws.com/storybook.sprucelabs.ai/snow.jpg',
        members:
            'https://s3.amazonaws.com/storybook.sprucelabs.ai/theme-park.jpg',
    }

    private eventsBySlide: Record<SLIDE, string> = {
        intro: 'lsljiq',
        name: 'ylvvtu',
        values: '2spok6',
        members: 'r5s2ts',
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
                shouldRenderSubmitControls: false,
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
                shouldRenderSubmitControls: false,
                onChange: this.handleNameChange.bind(this),
                onSubmit: this.handleClickNext.bind(this),
                sections: [
                    {
                        text: {
                            content:
                                "Let's get started customizing your bedtime stories! It's very important that everyone is under the same name! We used our last name 'Romero', but you could really use anything you want, as long as it brings everyone together under one banner!",
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

    private renderFooter(): CardFooter {
        return {
            isSticky: true,
            buttons: [
                this.optionallyRenderBackButton(),
                this.renderNextButton(),
                this.optionallyRenderSkipButton(),
            ].filter((b) => b) as Button[],
        }
    }

    private getSlideIdx() {
        return this.swipeVc?.getPresentSlide() ?? 0
    }

    private optionallyRenderSkipButton() {
        const idx = this.getSlideIdx()
        return idx == 0
            ? {
                  id: 'skip',
                  label: `I've done this, log me in already!`,
                  onClick: this.handleClickSkip.bind(this),
              }
            : null
    }

    private async handleClickSkip() {
        this.onboarding.skip()
        await this.router.redirect('eightbitstories.root')
    }

    private optionallyRenderBackButton() {
        const idx = this.getSlideIdx()
        return idx > 0
            ? {
                  id: 'back',
                  label: 'Back',
                  onClick: this.handleClickBack.bind(this),
              }
            : null
    }

    private async handleClickBack() {
        await this.jumpToSlide(-1)
    }

    private renderNextButton(): Button {
        let isEnabled = true
        const currentSlide = this.getPresentSlideId()

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

    public async load(options: SkillViewControllerLoadOptions): Promise<void> {
        const { router, authenticator } = options
        if (authenticator.isLoggedIn()) {
            await router.redirect('eightbitstories.root')
            return
        }

        this.trackEvent('lsljiq')

        this.router = router
    }

    private async handleClickNext() {
        if (this.getPresentSlideId() === 'members') {
            this.trackEvent('vhyhpq')
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

        this.onboarding.set({
            name,
            values,
        })

        await this.jumpToSlide(1)
    }

    private async jumpToSlide(direction: number) {
        await this.swipeVc.jumpToSlide(
            this.swipeVc.getPresentSlide() + direction
        )
    }

    private async handleSlideChange() {
        this.trackOnSlideChange()
        this.updateHeader()
        this.updateFooter()
    }

    private trackOnSlideChange() {
        const presentSlide = this.getPresentSlideId()
        const event = this.eventsBySlide[presentSlide]
        this.trackEvent(event)
    }

    private trackEvent(event: string) {
        this.plugins.mmp.trackEvent(event)
    }

    private updateHeader() {
        const header = this.renderHeader()
        this.swipeVc.setHeader(header)
    }

    private renderHeader() {
        const slide = this.getPresentSlideId()
        const title = this.titles[slide]
        const image = this.images[slide] ?? null

        const header = {
            title,
            image,
        }
        return header
    }

    private getPresentSlideId() {
        return (this.swipeVc?.getPresentSlideId() ?? 'intro') as SLIDE
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
        this.trackEvent('pi1iuf')
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

type SLIDE = 'intro' | 'name' | 'values' | 'members'
