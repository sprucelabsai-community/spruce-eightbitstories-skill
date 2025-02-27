import { interactor, vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { mmpAssert } from '@sprucelabs/spruce-mmp-vc-plugin'
import { generateId } from '@sprucelabs/test-utils'
import Onboarding from '../../../onboarding/Onboarding'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import SpyOnboardingSkillView from './SpyOnboardingSkillView'

export default abstract class AbstractOnboardingTest extends AbstractEightBitTest {
    protected vc!: SpyOnboardingSkillView

    protected async beforeEach() {
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

    protected Vc(): SpyOnboardingSkillView {
        return this.views.Controller(
            'eightbitstories.onboarding',
            {}
        ) as SpyOnboardingSkillView
    }

    protected get auth() {
        return this.permissions.getAuthenticator()
    }

    protected async load() {
        await this.views.load(this.vc)
    }

    protected get swipeVc() {
        return this.vc.getSwipeVc()
    }

    protected async clickNext() {
        await this.clickButton('next')
    }

    protected async clickButton(name: string) {
        await interactor.clickButton(this.swipeVc, name)
    }

    protected async jumpToNameSlide() {
        await this.jumpToSlide('name')
    }

    protected async jumpToSlide(slide: string) {
        await this.swipeVc.jumpToSlide(slide)
    }

    protected async setName(name?: string) {
        await this.nameFormVc.setValue('name', name ?? generateId())
    }

    protected async fillOutNameAndSubmit() {
        await this.jumpToNameSlide()
        await this.setName()
        await interactor.submitForm(this.nameFormVc)
    }

    protected get nameFormVc() {
        return this.vc.getNameFormVc()
    }

    protected async clickClearValuesButton() {
        await this.clickButton('clear')
    }

    protected async fillOutValues() {
        await this.valuesFormVc.setValue('values', generateId())
    }

    protected get valuesFormVc() {
        return this.vc.getValuesFormVc()
    }

    protected async fillOutNameAndValues() {
        await this.fillOutNameSubmitAndClearValues()
        await this.fillOutValues()
    }

    protected async fillOutNameSubmitAndClearValues() {
        await this.fillOutNameAndSubmit()
        await this.clickClearValuesButton()
    }

    protected async clickNextAndAssertRedirect() {
        await vcAssert.assertActionRedirects({
            action: () => this.clickNext(),
            destination: {
                id: 'eightbitstories.root',
            },
            router: this.views.getRouter(),
        })
    }
}
