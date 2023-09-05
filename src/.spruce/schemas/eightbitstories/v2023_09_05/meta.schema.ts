import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const metaSchema: SpruceSchemas.Eightbitstories.v2023_09_05.MetaSchema  = {
	id: 'meta',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: 'Meta',
	    fields: {
	            /** Family Name. */
	            'name': {
	                label: 'Family Name',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** Values. */
	            'values': {
	                label: 'Values',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(metaSchema)

export default metaSchema
