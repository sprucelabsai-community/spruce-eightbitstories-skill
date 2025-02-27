import {
    formAssert,
    interactor,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { eventFaker, fake } from '@sprucelabs/spruce-test-fixtures'
import {
    test,
    suite,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import { SubmitFeedbackTargetAndPayload } from '../../support/EventFaker'
import { SpyFeedbackCard } from './SpyFeedCard'

@fake.login()
@suite()
export default class FeedbackCardTest extends AbstractEightBitTest {
    private vc!: SpyFeedbackCard
    private wasOnSubmitCalled!: boolean

    protected async beforeEach() {
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
    protected async throwsWhenMissingRequired() {
        const err = assert.doesThrow(() =>
            //@ts-ignore
            this.views.Controller('eightbitstories.feedback-card', {})
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['onSubmit'],
        })
    }

    @test()
    protected async rendersFormWithExpectedFields() {
        formAssert.cardRendersForm(this.vc)
        formAssert.formRendersFields(this.formVc, ['feedback'])
        formAssert.formFieldRendersAs(this.formVc, 'feedback', 'textarea')
        assert.isFalse(this.formVc.getShouldRenderCancelButton())
    }

    @test()
    protected async rendersAlertWhenFailsToSave() {
        await eventFaker.makeEventThrow(
            'eightbitstories.submit-feedback::v2023_09_05'
        )
        await vcAssert.assertRendersAlert(this.vc, () => this.submit())
        this.assertOnSubmitNotCalled()
    }

    @test()
    protected async emitsSubmitEventWhenFormSubmitted() {
        let passedPayload: SubmitFeedbackTargetAndPayload['payload'] | undefined

        await this.eventFaker.fakeSubmitFeedback(({ payload }) => {
            passedPayload = payload
        })

        const feedback = await this.setRandomFeedback()
        await this.submit()

        assert.isEqual(passedPayload?.feedback, feedback)
    }

    @test()
    protected async callsOnCompleteWhenFormSubmitted() {
        this.assertOnSubmitNotCalled()
        await this.setRandomFeedback()
        await this.submit()
        assert.isTrue(this.wasOnSubmitCalled)
    }

    private async setRandomFeedback() {
        const feedback = generateId()
        await this.formVc.setValue('feedback', feedback)
        return feedback
    }

    private assertOnSubmitNotCalled() {
        assert.isFalse(this.wasOnSubmitCalled)
    }

    private submit() {
        return interactor.submitForm(this.formVc)
    }

    private get formVc() {
        return this.vc.getFormVc()
    }
}
