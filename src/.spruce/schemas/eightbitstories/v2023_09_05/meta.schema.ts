import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import metaTargetSchema_v2023_09_05 from '#spruce/schemas/eightbitstories/v2023_09_05/metaTarget.schema'

const metaSchema: SpruceSchemas.Eightbitstories.v2023_09_05.MetaSchema  = {
	id: 'meta',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: 'Meta',
	    fields: {
	            /** . */
	            'id': {
	                type: 'id',
	                isPrivate: true,
	                isRequired: true,
	                options: undefined
	            },
	            /** Family Name. You can use your last name or come up with something totally unique. This is how your family will be referred to in your stories. */
	            'name': {
	                label: 'Family Name',
	                type: 'text',
	                isRequired: true,
	                hint: 'You can use your last name or come up with something totally unique. This is how your family will be referred to in your stories.',
	                options: undefined
	            },
	            /** Your Values. Type in anything you want. It can be a bulleted list, a paragraph, or even a poem. These values will be incorporated into all your stories. */
	            'values': {
	                label: 'Your Values',
	                type: 'text',
	                isRequired: true,
	                hint: 'Type in anything you want. It can be a bulleted list, a paragraph, or even a poem. These values will be incorporated into all your stories.',
	                options: undefined
	            },
	            /** . */
	            'target': {
	                type: 'schema',
	                isPrivate: true,
	                isRequired: true,
	                options: {schema: metaTargetSchema_v2023_09_05,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(metaSchema)

export default metaSchema
