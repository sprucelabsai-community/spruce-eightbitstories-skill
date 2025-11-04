import '#spruce/permissions/permissions.types'
import getMmpSetupResponsePayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/getMmpSetupResponsePayload.schema'
import { buildEventContract } from '@sprucelabs/mercury-types'


const getMmpSetupEventContract = buildEventContract({
    eventSignatures: {
        'eightbitstories.get-mmp-setup::v2023_09_05': {
            isGlobal: true,
            
            
            
            emitPermissions: {"contractId":"eightbitstories.eight-bit-stories","permissionIdsAny":["can-mmp"]},
            
            
            responsePayloadSchema: getMmpSetupResponsePayloadSchema,
            
            
        }
    }
})
export default getMmpSetupEventContract

export type GetMmpSetupEventContract = typeof getMmpSetupEventContract
