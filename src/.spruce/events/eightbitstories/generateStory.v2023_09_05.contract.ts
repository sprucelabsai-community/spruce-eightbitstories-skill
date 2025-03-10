import '#spruce/permissions/permissions.types'
import generateStoryEmitTargetAndPayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/generateStoryEmitTargetAndPayload.schema'
import { buildEventContract } from '@sprucelabs/mercury-types'


const generateStoryEventContract = buildEventContract({
    eventSignatures: {
        'eightbitstories.generate-story::v2023_09_05': {
            isGlobal: true,
            
            
            emitPermissions: {"contractId":"eightbitstories.eight-bit-stories","permissionIdsAny":["can-generate-story"]},
            
            emitPayloadSchema: generateStoryEmitTargetAndPayloadSchema,
            
            
            
        }
    }
})
export default generateStoryEventContract

export type GenerateStoryEventContract = typeof generateStoryEventContract