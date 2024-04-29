import '#spruce/permissions/permissions.types'
import saveMetaEmitTargetAndPayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/saveMetaEmitTargetAndPayload.schema'
import saveMetaResponsePayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/saveMetaResponsePayload.schema'
import { buildEventContract } from '@sprucelabs/mercury-types'


const saveMetaEventContract = buildEventContract({
    eventSignatures: {
        'eightbitstories.save-meta::v2023_09_05': {
            isGlobal: true,
            emitPermissions: {"contractId":"eightbitstories.eight-bit-stories","permissionIdsAny":["can-save-family-meta"]},
            
            emitPayloadSchema: saveMetaEmitTargetAndPayloadSchema,
            responsePayloadSchema: saveMetaResponsePayloadSchema,
            
            
        }
    }
})
export default saveMetaEventContract

export type SaveMetaEventContract = typeof saveMetaEventContract