import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import Onboarding from '../../../onboarding/Onboarding'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class OnboardingTrackerTest extends AbstractEightBitTest {
    @test()
    protected static async defaultsToNotOnboarding() {
        const onboarding = Onboarding.getInstance()
        assert.isFalse(onboarding.isOnboarding)
    }
}
