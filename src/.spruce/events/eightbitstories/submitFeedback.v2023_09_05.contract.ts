import '#spruce/permissions/permissions.types'
import submitFeedbackEmitTargetAndPayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/submitFeedbackEmitTargetAndPayload.schema'
import submitFeedbackResponsePayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/submitFeedbackResponsePayload.schema'
import { buildEventContract } from '@sprucelabs/mercury-types'


const submitFeedbackEventContract = buildEventContract({
    eventSignatures: {
        'eightbitstories.submit-feedback::v2023_09_05': {
            isGlobal: true,
            
            
            emitPermissions: {"contractId":"eightbitstories.eight-bit-stories","permissionIdsAny":["can-submit-feedback"]},
            
            emitPayloadSchema: submitFeedbackEmitTargetAndPayloadSchema,
            responsePayloadSchema: submitFeedbackResponsePayloadSchema,
            
            
        }
    }
})
export default submitFeedbackEventContract

export type SubmitFeedbackEventContract = typeof submitFeedbackEventContract