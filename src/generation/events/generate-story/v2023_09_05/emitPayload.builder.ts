import { buildSchema } from '@sprucelabs/schema'

const generateStoryEmitPayloadBuilder = buildSchema({
    id: 'generateStoryEmitPayload',
    fields: {
        storyElements: {
            type: 'id',
            isArray: true,
            minArrayLength: 1,
            isRequired: true,
        },
        familyMembers: {
            type: 'id',
            isArray: true,
            minArrayLength: 1,
            isRequired: true,
        },
        currentChallenge: {
            type: 'text',
        },
        storyHash: {
            type: 'id',
            isRequired: true,
        },
    },
})

export default generateStoryEmitPayloadBuilder
