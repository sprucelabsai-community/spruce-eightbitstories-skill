import { SkillEventContract } from '@sprucelabs/mercury-types'
import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export default async (
	event: SpruceEvent<SkillEventContract, EmitPayload>
): SpruceEventResponse<ResponsePayload> => {
	const { stores, payload } = event
	const { meta } = payload

	const metas = await stores.getStore('meta')
	const count = await metas.count()

	if (count === 0) {
		await metas.createOne(meta)
	}

	return {
		meta,
	}
}

type EmitPayload =
	SpruceSchemas.Eightbitstories.v2023_09_05.SaveMetaEmitTargetAndPayload

type ResponsePayload =
	SpruceSchemas.Eightbitstories.v2023_09_05.SaveMetaResponsePayload
