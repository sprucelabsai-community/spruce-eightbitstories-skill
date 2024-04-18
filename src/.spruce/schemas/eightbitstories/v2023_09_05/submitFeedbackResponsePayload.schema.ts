import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

const submitFeedbackResponsePayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.SubmitFeedbackResponsePayloadSchema =
    {
        id: 'submitFeedbackResponsePayload',
        version: 'v2023_09_05',
        namespace: 'Eightbitstories',
        name: '',
        fields: {
            /** . */
            success: {
                type: 'boolean',
                isRequired: true,
                options: undefined,
            },
        },
    }

SchemaRegistry.getInstance().trackSchema(submitFeedbackResponsePayloadSchema)

export default submitFeedbackResponsePayloadSchema
