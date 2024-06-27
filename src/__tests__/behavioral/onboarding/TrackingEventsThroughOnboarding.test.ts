import { mmpAssert } from '@sprucelabs/spruce-mmp-vc-plugin'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import AbstractOnboardingTest from './AbstractOnboardingTest'

@fake.login()
export default class TrackingEventsThroughOnboardingTest extends AbstractOnboardingTest {
    @test()
    protected static async onboardingFiresOnLoad() {
        await mmpAssert.didTrackEvent({
            action: () => this.load(),
            eventName: 'lsljiq',
        })
    }
}
