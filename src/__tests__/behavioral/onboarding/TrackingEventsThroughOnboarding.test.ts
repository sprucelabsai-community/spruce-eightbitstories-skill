import { mmpAssert } from '@sprucelabs/spruce-mmp-vc-plugin'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, suite } from '@sprucelabs/test-utils'
import AbstractOnboardingTest from './AbstractOnboardingTest'

@fake.login()
@suite()
export default class TrackingEventsThroughOnboardingTest extends AbstractOnboardingTest {
    @test()
    protected async firesOnLoad() {
        await this.assertDidTrack(() => this.load(), 'lsljiq')
    }

    @test()
    protected async firesClickNextPastIntro() {
        await this.assertDidTrack(() => this.clickNext(), 'ylvvtu')
    }

    @test()
    protected async firesIfSwipingPastIntro() {
        await this.assertDidTrack(() => this.jumpToNameSlide(), 'ylvvtu')
    }

    @test()
    protected async firesAfterSubmittingFamilyName() {
        await this.assertDidTrack(() => this.fillOutNameAndSubmit(), '2spok6')
    }

    @test()
    protected async firesAfterClearingFamilyValues() {
        await this.fillOutNameAndSubmit()
        await this.assertDidTrack(() => this.clickClearValuesButton(), 'pi1iuf')
    }

    @test()
    protected async firesAfterFillingOutFamilyValues() {
        await this.fillOutNameAndValues()
        await this.assertDidTrack(() => this.clickNext(), 'r5s2ts')
    }

    @test()
    protected async firesAtEndOfOnboarding() {
        await this.fillOutNameAndValues()
        await this.clickNext()
        await this.assertDidTrack(
            () => this.clickNextAndAssertRedirect(),
            'vhyhpq'
        )
    }

    private async assertDidTrack(
        action: () => Promise<void>,
        eventName: string
    ) {
        await mmpAssert.didTrackEvent({
            action,
            eventName,
        })
    }
}
