import { randomUtil } from '@sprucelabs/spruce-skill-utils'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, assert, generateId } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import { SendMessageTargetAndPayload } from '../../support/EventFaker'

@fake.login()
@suite()
export default class SubmitFeedbackListenerTest extends AbstractEightBitTest {
    private randomFeedback!: string

    protected async beforeEach(): Promise<void> {
        await super.beforeEach()

        await this.bootSkill()

        this.randomFeedback = generateId()

        await this.eventFaker.fakeSendMessage()
    }

    @test()
    protected async isListening() {
        await this.submitFeedback()
    }

    @test()
    protected async sendsMessageToPersonIdAsSkill() {
        process.env.FEEDBACK_PERSON_PHONE = randomUtil.rand([
            '555-000-2222',
            '555-000-2235',
        ])

        let passedTarget: SendMessageTargetAndPayload['target'] | undefined
        let passedPayload: SendMessageTargetAndPayload['payload'] | undefined
        let passedSource: SendMessageTargetAndPayload['source'] | undefined

        await this.eventFaker.fakeSendMessage(({ target, payload, source }) => {
            passedTarget = target
            passedPayload = payload
            passedSource = source
        })

        await this.submitFeedback()

        assert.isEqualDeep(passedTarget, {
            phone: process.env.FEEDBACK_PERSON_PHONE,
        })

        assert.isEqualDeep(passedPayload, {
            message: {
                classification: 'transactional',
                body:
                    `8-bit feedback: ` +
                    this.randomFeedback +
                    `\n\nhttps://spruce.bot/#views/feed.root?personId=${this.fakedPerson.id}`,
            },
        })

        const { skill } = await this.skills.loginAsCurrentSkill()

        assert.isEqualDeep(passedSource, {
            skillId: skill.id,
        })
    }

    private async submitFeedback() {
        await this.fakedClient.emitAndFlattenResponses(
            'eightbitstories.submit-feedback::v2023_09_05',
            {
                payload: {
                    feedback: this.randomFeedback,
                },
            }
        )
    }
}
