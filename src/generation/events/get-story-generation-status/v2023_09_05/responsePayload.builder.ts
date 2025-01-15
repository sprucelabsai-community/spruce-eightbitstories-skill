import { buildSchema } from '@sprucelabs/schema'

const getStoryGenerationStatusResponsePayloadBuilder = buildSchema({
    id: 'getStoryGenerationStatusResponsePayload',
    fields: {
        storyId: {
            type: 'id',
        },
        status: {
            type: 'select',
            isRequired: true,
            options: {
                choices: [
                    {
                        label: 'Generating',
                        value: 'generating',
                    },
                    {
                        label: 'Ready',
                        value: 'ready',
                    },
                ],
            },
        },
    },
})

export default getStoryGenerationStatusResponsePayloadBuilder
