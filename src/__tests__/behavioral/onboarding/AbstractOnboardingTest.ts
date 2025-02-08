import { interactor, vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { mmpAssert } from '@sprucelabs/spruce-mmp-vc-plugin'
import { generateId } from '@sprucelabs/test-utils'
import Onboarding from '../../../onboarding/Onboarding'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import SpyOnboardingSkillView from './SpyOnboardingSkillView'

export default abstract class AbstractOnboardingTest extends AbstractEightBitTest {
    protected static vc: SpyOnboardingSkillView

    protected static async beforeEach() {
        await super.beforeEach()

        Onboarding.clear()

        this.views.setController(
            'eightbitstories.onboarding',
            SpyOnboardingSkillView
        )

        mmpAssert.beforeEach(this.views.getFactory())

        this.vc = this.Vc()

        await this.auth.clearSession()

        await this.load()
    }

    protected static Vc(): SpyOnboardingSkillView {
        return this.views.Controller(
            'eightbitstories.onboarding',
            {}
        ) as SpyOnboardingSkillView
    }

    protected static get auth() {
        return this.permissions.getAuthenticator()
    }

    protected static async load() {
        await this.views.load(this.vc)
    }

    protected static get swipeVc() {
        return this.vc.getSwipeVc()
    }

    protected static async clickNext() {
        await this.clickButton('next')
    }

    protected static async clickButton(name: string) {
        await interactor.clickButton(this.swipeVc, name)
    }

    protected static async jumpToNameSlide() {
        await this.jumpToSlide('name')
    }

    protected static async jumpToSlide(slide: string) {
        await this.swipeVc.jumpToSlide(slide)
    }

    protected static async setName(name?: string) {
        await this.nameFormVc.setValue('name', name ?? generateId())
    }

    protected static async fillOutNameAndSubmit() {
        await this.jumpToNameSlide()
        await this.setName()
        await interactor.submitForm(this.nameFormVc)
    }

    protected static get nameFormVc() {
        return this.vc.getNameFormVc()
    }

    protected static async clickClearValuesButton() {
        await this.clickButton('clear')
    }

    protected static async fillOutValues() {
        await this.valuesFormVc.setValue('values', generateId())
    }

    protected static get valuesFormVc() {
        return this.vc.getValuesFormVc()
    }

    protected static async fillOutNameAndValues() {
        await this.fillOutNameSubmitAndClearValues()
        await this.fillOutValues()
    }

    protected static async fillOutNameSubmitAndClearValues() {
        await this.fillOutNameAndSubmit()
        await this.clickClearValuesButton()
    }

    protected static async clickNextAndAssertRedirect() {
        await vcAssert.assertActionRedirects({
            action: () => this.clickNext(),
            destination: {
                id: 'eightbitstories.root',
            },
            router: this.views.getRouter(),
        })
    }
}
