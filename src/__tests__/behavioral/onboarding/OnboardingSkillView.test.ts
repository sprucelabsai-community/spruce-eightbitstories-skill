import {
    buttonAssert,
    formAssert,
    navigationAssert,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import Onboarding from '../../../onboarding/Onboarding'
import AbstractOnboardingTest from './AbstractOnboardingTest'

@fake.login()
export default class OnboardingSkillViewTest extends AbstractOnboardingTest {
    @test()
    protected static async rendersExpectedCard() {
        vcAssert.assertSkillViewRendersSwipeCard(this.vc)
    }

    @test()
    protected static async doesNotRenderNav() {
        navigationAssert.skillViewDoesNotRenderNavigation(this.vc)
    }

    @test()
    protected static async swipeRendersExpectedSlides() {
        const section = ['intro', 'name', 'values', 'members']
        for (const slide of section) {
            vcAssert.assertCardRendersSection(this.swipeVc, slide)
        }
    }

    @test()
    protected static async headerStartsAsExpected() {
        const title = 'Unlimited Personalized Bedtime Stories'
        this.assertExpectedHeader(title)
    }

    @test(
        'updates intro header',
        'intro',
        'Unlimited Personalized Bedtime Stories'
    )
    @test(
        'updates name header',
        'name',
        'Family Name',
        `https://s3.amazonaws.com/storybook.sprucelabs.ai/onboarding-boat.jpg`
    )
    @test(
        'updates values header',
        'values',
        'Family Values',
        'https://s3.amazonaws.com/storybook.sprucelabs.ai/snow.jpg'
    )
    @test(
        'updates members header',
        'members',
        'Family Members',
        'https://s3.amazonaws.com/storybook.sprucelabs.ai/theme-park.jpg'
    )
    protected static async rendersExpectedHeaderTitleBasedOnSlide(
        slide: string,
        expectedTitle: string,
        expectedImage: string | undefined
    ) {
        await this.jumpToSlide(slide)

        this.assertExpectedHeader(expectedTitle, expectedImage)
    }

    @test()
    protected static async introSlideRendersNextButton() {
        this.assertRendersNextButton()
    }

    @test()
    protected static async clickingNextOnIntroJumpsToNameSlide() {
        await this.clickNext()
        this.assertPresentSlide('name')
    }

    @test()
    protected static async rendersNameForm() {
        formAssert.cardRendersForm(this.swipeVc, 'name')
        formAssert.formRendersField(this.nameFormVc, 'name')
        assert.isFalse(this.nameFormVc.getShouldRenderSubmitControls())
    }

    @test()
    protected static async enteringNameUpdatesHeader() {
        const name = generateId()

        await this.jumpToNameSlide()
        await this.setName(name)

        this.assertExpectedHeader(`The ${name}s`)
    }

    @test()
    protected static async clearingNameResetsHeader() {
        await this.jumpToNameSlide()
        await this.setName(generateId())
        await this.setName('')

        this.assertExpectedHeader('Family Name')
    }

    @test()
    protected static async nextButtonIsDisabledUntilNameIsEntered() {
        this.assertNextButtonIsEnabled()
        await this.jumpToNameSlide()
        this.assertNextButtonIsDisabled()
    }

    @test()
    protected static async fillingOutNameEnablesNextButton() {
        await this.jumpToNameSlide()
        await this.setName()
        this.assertNextButtonIsEnabled()
    }

    @test()
    protected static async clickingNextOnNameJumpsToValuesSlide() {
        await this.jumpToNameSlide()
        await this.setName()
        await this.clickNext()
        this.assertPresentSlide('values')
    }

    @test()
    protected static async submittingTheNameFormJumpsToValuesSlide() {
        await this.fillOutNameAndSubmit()
        this.assertPresentSlide('values')
    }

    @test()
    protected static async valuesSlideRendersValuesForm() {
        formAssert.cardRendersForm(this.swipeVc, 'values')
        formAssert.formRendersField(this.valuesFormVc, 'values')
        formAssert.formFieldRendersAs(this.valuesFormVc, 'values', 'textarea')
        assert.isFalse(this.valuesFormVc.getShouldRenderSubmitControls())
    }

    @test()
    protected static async startsWithExpectedValues() {
        await this.jumpToNameSlide()

        const name = generateId()
        await this.setName(name)
        await this.clickNext()

        this.assertValuesEqual(
            `A ${name} always tries their best.\nA ${name} never gives up, but knows when to pivot.\nA ${name} makes sure everyone is safe, starting with family.`
        )
    }

    @test()
    protected static async valuesSlideHasClearButton() {
        await this.fillOutNameAndSubmit()
        this.assertRendersButton('clear')
    }

    @test()
    protected static async clickingClearClearsValues() {
        await this.fillOutNameSubmitAndClearValues()
        const values = this.getValues()
        assert.isFalsy(values)
        this.assertDoesNotRenderButton('clear')
    }

    @test()
    protected static async clearedValuesDisablesNextButton() {
        await this.fillOutNameSubmitAndClearValues()
        this.assertNextButtonIsDisabled()
    }

    @test()
    protected static async fillingOutValuesEnablesNextButton() {
        await this.fillOutNameAndValues()
        this.assertNextButtonIsEnabled()
    }

    @test()
    protected static async submittingMembersRedirectsToMembersSvc() {
        await this.fillEverythingOutClickNextAndAssertRedirect()
    }

    @test()
    protected static async allSlidesButFirstRenderTheBackButton() {
        this.assertDoesNotRenderButton('back')
        await this.clickNext()
        this.assertRendersButton('back')
    }

    @test()
    protected static async goingBackFromNameJumpsToIntro() {
        await this.clickNext()
        await this.clickBack()
        this.assertPresentSlide('intro')
    }

    @test()
    protected static async goingBackFromValuesThenToValuesDoesNotClobberValues() {
        await this.fillOutNameAndValues()
        const values = this.getValues()
        await this.clickBack()
        await this.clickNext()
        this.assertValuesEqual(values)
    }

    @test()
    protected static async nameAndValuesSavedInOnboardingSingleton() {
        await this.fillEverythingOutClickNextAndAssertRedirect()
        const values = this.getValues()

        const name = this.nameFormVc.getValue('name')
        const onboarding = Onboarding.getInstance()
        assert.isEqual(onboarding.name, name)
        assert.isEqual(onboarding.values, values)
        assert.isTrue(onboarding.isOnboarding)
    }

    @test()
    protected static async redirectsToRootIfLoggedIn() {
        this.vc = this.Vc()
        this.auth.setSessionToken(this.fakedPerson.id, this.fakedPerson)
        await vcAssert.assertActionRedirects({
            action: () => this.load(),
            destination: {
                id: 'eightbitstories.root',
            },
            router: this.views.getRouter(),
        })
    }

    @test()
    protected static async firstSlideRendersSkipButton() {
        this.assertRendersButton('skip')
        await this.clickNext()
        this.assertDoesNotRenderButton('skip')
    }

    @test()
    protected static async clickingSkipRedirectsToRoot() {
        const onboarding = Onboarding.getInstance()

        assert.isFalse(onboarding.didSkipOnboarding)

        await vcAssert.assertActionRedirects({
            action: () => this.clickButton('skip'),
            destination: {
                id: 'eightbitstories.root',
            },
            router: this.views.getRouter(),
        })

        assert.isTrue(onboarding.didSkipOnboarding)
    }

    private static async fillEverythingOutClickNextAndAssertRedirect() {
        await this.fillOutNameAndValues()
        await this.clickNext()
        await this.clickNextAndAssertRedirect()
    }

    private static async clickBack() {
        await this.clickButton('back')
    }

    private static assertDoesNotRenderButton(name: string) {
        buttonAssert.cardDoesNotRenderButton(this.swipeVc, name)
    }

    private static getValues() {
        return this.valuesFormVc.getValue('values')
    }

    private static assertRendersButton(name: string) {
        buttonAssert.cardRendersButton(this.swipeVc, name)
    }

    private static assertPresentSlide(slide: string) {
        assert.isEqual(this.swipeVc.getPresentSlideId(), slide)
    }

    private static assertNextButtonIsDisabled() {
        buttonAssert.buttonIsDisabled(this.swipeVc, 'next')
    }

    private static assertNextButtonIsEnabled() {
        buttonAssert.buttonIsEnabled(this.swipeVc, 'next')
    }

    private static assertExpectedHeader(
        expectedTitle: string,
        expectedImage?: string
    ) {
        const { header } = this.views.render(this.swipeVc)

        assert.isEqual(header?.title, expectedTitle)

        if (expectedImage) {
            assert.isEqual(header?.image, expectedImage)
        }
    }

    private static assertValuesEqual(expected: string) {
        const values = this.getValues()
        assert.isEqual(values, expected)
    }

    private static assertRendersNextButton() {
        this.assertRendersButton('next')
    }
}
