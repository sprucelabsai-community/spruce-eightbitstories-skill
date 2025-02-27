import {
    buttonAssert,
    interactor,
    navigationAssert,
    SkillViewControllerId,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { assert, test, suite } from '@sprucelabs/test-utils'
import FeedbackCardViewController from '../../feedback/FeedbackCard.vc'
import Onboarding from '../../onboarding/Onboarding'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import AbstractEightBitTest from '../support/AbstractEightBitTest'
import { SpyFeedbackCard } from './feedback/SpyFeedCard'

@fake.login()
@suite()
export default class RootSkillViewTest extends AbstractEightBitTest {
    private vc!: SpyRootSkillView

    protected async beforeEach() {
        await super.beforeEach()

        this.views.setController(
            'eightbitstories.feedback-card',
            SpyFeedbackCard
        )
        this.views.setController('eightbitstories.root', SpyRootSkillView)
        this.vc = this.Vc()

        await this.eventFaker.fakeGetMmpSetup()
        await this.load()
    }

    @test()
    protected rendersCard() {
        vcAssert.assertSkillViewRendersCard(this.vc, 'controls')
    }

    @test()
    protected async rendersExpectedButtons() {
        buttonAssert.cardRendersButtons(this.cardVc, [
            'meta',
            'members',
            'generate',
            'feedback',
        ])
    }

    @test()
    protected async noFeedbackButtonIfNotLoggedInAndSkippingOnboarding() {
        Onboarding.getInstance().skip()

        await this.auth.clearSession()
        this.vc = this.Vc()

        await this.load()

        buttonAssert.cardDoesNotRenderButton(this.cardVc, 'feedback')
    }

    @test()
    protected async clickingMetaRedirectsToMetaSkillView() {
        await this.assertClickingButtonRedirects('meta', 'eightbitstories.meta')
    }

    @test()
    protected async clickingMembersRedirectsToMembersSkillView() {
        await this.assertClickingButtonRedirects(
            'members',
            'eightbitstories.members'
        )
    }

    @test()
    protected async clickingGenerateRedirectsToGenerateSkillView() {
        await this.assertClickingButtonRedirects(
            'generate',
            'eightbitstories.generate'
        )
    }

    @test()
    protected async rendersNullNav() {
        navigationAssert.skillViewDoesNotRenderNavigation(this.vc)
    }

    @test()
    protected async clickingFeedbackRendersDialog() {
        await this.clickFeedbackAndAssertDialog()
    }

    @test()
    protected async submittingFormHidesDialog() {
        const { feedbackVc, dlgVc } = await this.clickFeedbackAndAssertDialog()
        const handler = feedbackVc.getOnSubmitHandler()

        await handler()

        assert.isFalse(dlgVc.getIsVisible())
    }

    private async clickFeedbackAndAssertDialog() {
        const dlgVc = await vcAssert.assertRendersDialog(this.vc, () =>
            this.clickButton('feedback')
        )

        const feedbackVc = vcAssert.assertRendersAsInstanceOf(
            dlgVc,
            FeedbackCardViewController
        ) as SpyFeedbackCard

        return { feedbackVc, dlgVc }
    }

    private Vc(): SpyRootSkillView {
        return this.views.Controller(
            'eightbitstories.root',
            {}
        ) as SpyRootSkillView
    }

    private get auth() {
        return this.permissions.getAuthenticator()
    }

    private async assertClickingButtonRedirects(
        button: string,
        destination: SkillViewControllerId
    ) {
        await vcAssert.assertActionRedirects({
            action: () => this.clickButton(button),
            router: this.views.getRouter(),
            destination: {
                id: destination,
            },
        })
    }

    private clickButton(button: string): any {
        return interactor.clickButton(this.cardVc, button)
    }

    private async load() {
        await this.views.load(this.vc)
    }

    private get cardVc() {
        return this.vc.getCardVc()
    }
}

class SpyRootSkillView extends RootSkillViewController {
    public getCardVc() {
        return this.cardVc
    }
}
