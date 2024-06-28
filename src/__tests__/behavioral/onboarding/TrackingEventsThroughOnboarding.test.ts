import { mmpAssert } from '@sprucelabs/spruce-mmp-vc-plugin'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import AbstractOnboardingTest from './AbstractOnboardingTest'

@fake.login()
export default class TrackingEventsThroughOnboardingTest extends AbstractOnboardingTest {
    @test()
    protected static async firesOnLoad() {
        await this.assertDidTrack(() => this.load(), 'lsljiq')
    }

    @test()
    protected static async firesClickNextPastIntro() {
        await this.assertDidTrack(() => this.clickNext(), 'ylvvtu')
    }

    @test()
    protected static async firesIfSwipingPastIntro() {
        await this.assertDidTrack(() => this.jumpToNameSlide(), 'ylvvtus')
    }

    @test()
    protected static async firesAfterSubmittingFamilyName() {
        await this.assertDidTrack(() => this.fillOutNameAndSubmit(), '2spok6')
    }

    @test()
    protected static async firesAfterClearingFamilyValues() {
        await this.fillOutNameAndSubmit()
        await this.assertDidTrack(() => this.clickClearValuesButton(), 'pi1iuf')
    }

    @test()
    protected static async firesAfterFillingOutFamilyValues() {
        await this.fillOutNameAndValues()
        await this.assertDidTrack(() => this.clickNext(), 'r5s2ts')
    }

    @test()
    protected static async firesAtEndOfOnboarding() {
        await this.fillOutNameAndValues()
        await this.clickNext()
        await this.assertDidTrack(
            () => this.clickNextAndAssertRedirect(),
            'vhyhpq'
        )
    }

    private static async assertDidTrack(
        action: () => Promise<void>,
        eventName: string
    ) {
        await mmpAssert.didTrackEvent({
            action,
            eventName,
        })
    }
}
