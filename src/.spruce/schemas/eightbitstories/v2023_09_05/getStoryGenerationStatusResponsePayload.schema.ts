import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const getStoryGenerationStatusResponsePayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.GetStoryGenerationStatusResponsePayloadSchema  = {
	id: 'getStoryGenerationStatusResponsePayload',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: '',
	    fields: {
	            /** . */
	            'storyId': {
	                type: 'id',
	                options: undefined
	            },
	            /** . */
	            'status': {
	                type: 'select',
	                isRequired: true,
	                options: {choices: [{"label":"Generating","value":"generating"},{"label":"Ready","value":"ready"}],}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(getStoryGenerationStatusResponsePayloadSchema)

export default getStoryGenerationStatusResponsePayloadSchema
