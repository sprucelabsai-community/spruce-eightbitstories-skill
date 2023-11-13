import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const getMetaSchema: SpruceSchemas.Eightbitstories.v2023_09_05.GetMetaSchema  = {
	id: 'getMeta',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: '',
	    fields: {
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
	    }
}

SchemaRegistry.getInstance().trackSchema(getMetaSchema)

export default getMetaSchema
