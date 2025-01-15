import { buildSchema } from '@sprucelabs/schema'

const getStoryGenerationStatusEmitTargetBuilder = buildSchema({
    id: 'getStoryGenerationStatusEmitTarget',
    fields: {
        storyHash: {
            type: 'id',
            isRequired: true,
        },
    },
})

export default getStoryGenerationStatusEmitTargetBuilder
