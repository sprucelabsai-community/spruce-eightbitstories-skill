import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const storySchema: SpruceSchemas.Eightbitstories.v2023_09_05.StorySchema  = {
	id: 'story',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: 'Story',
	    fields: {
	            /** . */
	            'id': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'dateGenerated': {
	                type: 'dateTime',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'body': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(storySchema)

export default storySchema
