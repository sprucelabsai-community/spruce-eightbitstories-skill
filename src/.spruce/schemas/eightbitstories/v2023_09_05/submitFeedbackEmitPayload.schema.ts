import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

const submitFeedbackEmitPayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.SubmitFeedbackEmitPayloadSchema =
    {
        id: 'submitFeedbackEmitPayload',
        version: 'v2023_09_05',
        namespace: 'Eightbitstories',
        name: '',
        fields: {
            /** . */
            feedback: {
                type: 'text',
                isRequired: true,
                options: undefined,
            },
        },
    }

SchemaRegistry.getInstance().trackSchema(submitFeedbackEmitPayloadSchema)

export default submitFeedbackEmitPayloadSchema
