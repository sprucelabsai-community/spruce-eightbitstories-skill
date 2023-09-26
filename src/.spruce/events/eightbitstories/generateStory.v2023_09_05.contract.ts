import '#spruce/permissions/permissions.types'
import { buildEventContract } from '@sprucelabs/mercury-types'
import generateStoryEmitTargetAndPayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/generateStoryEmitTargetAndPayload.schema'
import generateStoryResponsePayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/generateStoryResponsePayload.schema'

const generateStoryEventContract = buildEventContract({
	eventSignatures: {
		'eightbitstories.generate-story::v2023_09_05': {
			isGlobal: true,
			emitPermissions: {
				contractId: 'eightbitstories.eight-bit-stories',
				permissionIdsAny: ['can-generate-story'],
			},

			emitPayloadSchema: generateStoryEmitTargetAndPayloadSchema,
			responsePayloadSchema: generateStoryResponsePayloadSchema,
		},
	},
})
export default generateStoryEventContract

export type GenerateStoryEventContract = typeof generateStoryEventContract
