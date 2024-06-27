import { mmpAssert } from '@sprucelabs/spruce-mmp-vc-plugin'
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

        this.auth.clearSession()

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
}
