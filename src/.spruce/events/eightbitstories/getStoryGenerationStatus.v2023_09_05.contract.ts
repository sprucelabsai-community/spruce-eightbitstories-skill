import '#spruce/permissions/permissions.types'
import getStoryGenerationStatusEmitTargetAndPayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/getStoryGenerationStatusEmitTargetAndPayload.schema'
import getStoryGenerationStatusResponsePayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/getStoryGenerationStatusResponsePayload.schema'
import { buildEventContract } from '@sprucelabs/mercury-types'


const getStoryGenerationStatusEventContract = buildEventContract({
    eventSignatures: {
        'eightbitstories.get-story-generation-status::v2023_09_05': {
            isGlobal: true,
            
            
            emitPermissions: {"contractId":"eightbitstories.eight-bit-stories","permissionIdsAny":["can-read-story"]},
            
            emitPayloadSchema: getStoryGenerationStatusEmitTargetAndPayloadSchema,
            responsePayloadSchema: getStoryGenerationStatusResponsePayloadSchema,
            
            
        }
    }
})
export default getStoryGenerationStatusEventContract

export type GetStoryGenerationStatusEventContract = typeof getStoryGenerationStatusEventContract