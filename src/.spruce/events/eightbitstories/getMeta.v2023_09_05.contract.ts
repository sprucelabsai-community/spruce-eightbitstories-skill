import '#spruce/permissions/permissions.types'
import { buildEventContract } from '@sprucelabs/mercury-types'
import getMetaResponsePayloadSchema from '#spruce/schemas/eightbitstories/v2023_09_05/getMetaResponsePayload.schema'

const getMetaEventContract = buildEventContract({
	eventSignatures: {
		'eightbitstories.get-meta::v2023_09_05': {
			isGlobal: true,

			responsePayloadSchema: getMetaResponsePayloadSchema,
		},
	},
})
export default getMetaEventContract

export type GetMetaEventContract = typeof getMetaEventContract
