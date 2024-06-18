import { buildSchema } from '@sprucelabs/schema'

const getMmpSetupResponsePayloadBuilder = buildSchema({
    id: 'getMmpSetupResponsePayload',
    fields: {
        appToken: {
            type: 'id',
            isRequired: true,
        },
        environment: {
            type: 'text',
            isRequired: true,
        },
    },
})

export default getMmpSetupResponsePayloadBuilder
