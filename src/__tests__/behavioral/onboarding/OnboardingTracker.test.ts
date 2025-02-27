import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, assert } from '@sprucelabs/test-utils'
import Onboarding from '../../../onboarding/Onboarding'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
@suite()
export default class OnboardingTrackerTest extends AbstractEightBitTest {
    @test()
    protected async defaultsToNotOnboarding() {
        const onboarding = Onboarding.getInstance()
        assert.isFalse(onboarding.isOnboarding)
    }
}
