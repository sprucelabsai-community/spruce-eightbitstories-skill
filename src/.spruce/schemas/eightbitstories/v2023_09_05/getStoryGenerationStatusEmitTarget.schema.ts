import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const getStoryGenerationStatusEmitTargetSchema: SpruceSchemas.Eightbitstories.v2023_09_05.GetStoryGenerationStatusEmitTargetSchema  = {
	id: 'getStoryGenerationStatusEmitTarget',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: '',
	    fields: {
	            /** . */
	            'storyHash': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(getStoryGenerationStatusEmitTargetSchema)

export default getStoryGenerationStatusEmitTargetSchema
