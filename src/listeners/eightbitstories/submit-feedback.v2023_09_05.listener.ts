import { SkillEventContract } from '@sprucelabs/mercury-types'
import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export default async (
	event: SpruceEvent<SkillEventContract, EmitPayload>
): SpruceEventResponse<ResponsePayload> => {
	const { payload, source, connectToApiAsSkill } = event
	const { feedback } = payload
	const { personId } = source

	const client = await connectToApiAsSkill()

	await client.emitAndFlattenResponses('send-message::v2020_12_25', {
		target: {
			phone: process.env.FEEDBACK_PERSON_PHONE,
		},
		payload: {
			message: {
				body:
					`8-bit feedback: ` +
					feedback +
					`\n\nhttps://spruce.bot/#views/feed.root?personId=${personId}`,
				classification: 'transactional',
			},
		},
	})

	return {
		success: true,
	}
}

type EmitPayload =
	SpruceSchemas.Eightbitstories.v2023_09_05.SubmitFeedbackEmitTargetAndPayload

type ResponsePayload =
	SpruceSchemas.Eightbitstories.v2023_09_05.SubmitFeedbackResponsePayload
