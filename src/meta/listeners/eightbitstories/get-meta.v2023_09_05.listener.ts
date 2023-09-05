import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export default async (
	event: SpruceEvent
): SpruceEventResponse<ResponsePayload> => {
	const { stores } = event
	const metas = await stores.getStore('meta')
	const match = await metas.findOne({})
	delete match?.id
	return {
		meta: match,
	}
}

type ResponsePayload =
	SpruceSchemas.Eightbitstories.v2023_09_05.GetMetaResponsePayload
