import { SpruceEventResponse } from '@sprucelabs/spruce-event-utils'

import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export default async (): SpruceEventResponse<ResponsePayload> => {
    return {
        appToken: process.env.ADJUST_APP_TOKEN!,
        environment: process.env.ADJUST_ENVIRONMENT!,
    }
}

type ResponsePayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.GetMmpSetupResponsePayload
