import { SkillEventContract } from '@sprucelabs/mercury-types'
import {
    SpruceEvent,
    SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export default async (
    event: SpruceEvent<SkillEventContract, EmitPayload>
): SpruceEventResponse<ResponsePayload> => {
    const { stores, target } = event
    const { storyHash } = target

    const stories = await stores.getStore('stories')
    const match = await stories.findOne({
        'source.hash': storyHash,
    })

    return {
        status: match ? 'ready' : 'generating',
        storyId: match?.id,
    }
}

type EmitPayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.GetStoryGenerationStatusEmitTargetAndPayload

type ResponsePayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.GetStoryGenerationStatusResponsePayload
