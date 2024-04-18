import { SchemaRegistry } from '@sprucelabs/schema'
import submitFeedbackEmitPayloadSchema_v2023_09_05 from '#spruce/schemas/eightbitstories/v2023_09_05/submitFeedbackEmitPayload.schema'
import eventSourceSchema_v2021_09_13 from '#spruce/schemas/spruceEventUtils/v2021_09_13/eventSource.schema'
import { SpruceSchemas } from '../../schemas.types'

const submitFeedbackEmitTargetAndPayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.SubmitFeedbackEmitTargetAndPayloadSchema =
    {
        id: 'submitFeedbackEmitTargetAndPayload',
        version: 'v2023_09_05',
        namespace: 'Eightbitstories',
        name: '',
        fields: {
            /** Source. */
            source: {
                label: 'Source',
                type: 'schema',
                options: { schema: eventSourceSchema_v2021_09_13 },
            },
            /** . */
            payload: {
                type: 'schema',
                isRequired: true,
                options: {
                    schema: submitFeedbackEmitPayloadSchema_v2023_09_05,
                },
            },
        },
    }

SchemaRegistry.getInstance().trackSchema(
    submitFeedbackEmitTargetAndPayloadSchema
)

export default submitFeedbackEmitTargetAndPayloadSchema
