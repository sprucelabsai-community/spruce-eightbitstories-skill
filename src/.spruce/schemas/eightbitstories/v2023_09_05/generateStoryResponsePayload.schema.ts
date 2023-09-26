import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import publicStorySchema_v2023_09_05 from '#spruce/schemas/eightbitstories/v2023_09_05/publicStory.schema'

const generateStoryResponsePayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.GenerateStoryResponsePayloadSchema  = {
	id: 'generateStoryResponsePayload',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: '',
	    fields: {
	            /** . */
	            'story': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: publicStorySchema_v2023_09_05,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(generateStoryResponsePayloadSchema)

export default generateStoryResponsePayloadSchema
