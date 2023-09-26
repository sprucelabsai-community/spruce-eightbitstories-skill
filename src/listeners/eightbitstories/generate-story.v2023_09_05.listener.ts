import { SkillEventContract } from '@sprucelabs/mercury-types'
import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export default async (
	event: SpruceEvent<SkillEventContract, EmitPayload>
): SpruceEventResponse<ResponsePayload> => {
	const { generator, payload, source } = event
	const { familyMembers, storyElements } = payload

	const story = await generator.generate({
		familyMembers,
		storyElements,
		personId: source.personId!,
	})

	return {
		story,
	}
}

type EmitPayload =
	SpruceSchemas.Eightbitstories.v2023_09_05.GenerateStoryEmitTargetAndPayload

type ResponsePayload =
	SpruceSchemas.Eightbitstories.v2023_09_05.GenerateStoryResponsePayload
