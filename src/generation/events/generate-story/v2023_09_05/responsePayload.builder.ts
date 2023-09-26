import { buildSchema, dropPrivateFields } from '@sprucelabs/schema'
import storyBuilder from '../../../../schemas/v2023_09_05/story.builder'

const generateStoryResponsePayloadBuilder = buildSchema({
	id: 'generateStoryResponsePayload',
	fields: {
		story: {
			type: 'schema',
			isRequired: true,
			options: {
				schema: buildSchema({
					id: 'publicStory',
					fields: dropPrivateFields(storyBuilder.fields),
				}),
			},
		},
	},
})

export default generateStoryResponsePayloadBuilder
