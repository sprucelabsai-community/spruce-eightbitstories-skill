import {
    formAssert,
    interactor,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { eventFaker, fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import { SubmitFeedbackTargetAndPayload } from '../../support/EventFaker'
import { SpyFeedbackCard } from './SpyFeedCard'

@fake.login()
export default class FeedbackCardTest extends AbstractEightBitTest {
    private static vc: SpyFeedbackCard
    private static wasOnSubmitCalled: boolean

    protected static async beforeEach() {
        await super.beforeEach()

        await this.eventFaker.fakeSubmitFeedback()

        this.wasOnSubmitCalled = false

        this.views.setController(
            'eightbitstories.feedback-card',
            SpyFeedbackCard
        )
        this.vc = this.views.Controller('eightbitstories.feedback-card', {
            onSubmit: () => {
                this.wasOnSubmitCalled = true
            },
        }) as SpyFeedbackCard
    }

    @test()
    protected static async throwsWhenMissingRequired() {
        const err = assert.doesThrow(() =>
            //@ts-ignore
            this.views.Controller('eightbitstories.feedback-card', {})
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['onSubmit'],
        })
    }

    @test()
    protected static async rendersFormWithExpectedFields() {
        formAssert.cardRendersForm(this.vc)
        formAssert.formRendersFields(this.formVc, ['feedback'])
        formAssert.formFieldRendersAs(this.formVc, 'feedback', 'textarea')
        assert.isFalse(this.formVc.getShouldRenderCancelButton())
    }

    @test()
    protected static async rendersAlertWhenFailsToSave() {
        await eventFaker.makeEventThrow(
            'eightbitstories.submit-feedback::v2023_09_05'
        )
        await vcAssert.assertRendersAlert(this.vc, () => this.submit())
        this.assertOnSubmitNotCalled()
    }

    @test()
    protected static async emitsSubmitEventWhenFormSubmitted() {
        let passedPayload: SubmitFeedbackTargetAndPayload['payload'] | undefined

        await this.eventFaker.fakeSubmitFeedback(({ payload }) => {
            passedPayload = payload
        })

        const feedback = await this.setRandomFeedback()
        await this.submit()

        assert.isEqual(passedPayload?.feedback, feedback)
    }

    @test()
    protected static async callsOnCompleteWhenFormSubmitted() {
        this.assertOnSubmitNotCalled()
        await this.setRandomFeedback()
        await this.submit()
        assert.isTrue(this.wasOnSubmitCalled)
    }

    private static async setRandomFeedback() {
        const feedback = generateId()
        await this.formVc.setValue('feedback', feedback)
        return feedback
    }

    private static assertOnSubmitNotCalled() {
        assert.isFalse(this.wasOnSubmitCalled)
    }

    private static submit() {
        return interactor.submitForm(this.formVc)
    }

    private static get formVc() {
        return this.vc.getFormVc()
    }
}
