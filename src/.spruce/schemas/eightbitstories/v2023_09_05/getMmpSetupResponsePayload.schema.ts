import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const getMmpSetupResponsePayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.GetMmpSetupResponsePayloadSchema  = {
	id: 'getMmpSetupResponsePayload',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: '',
	    fields: {
	            /** . */
	            'appToken': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'environment': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(getMmpSetupResponsePayloadSchema)

export default getMmpSetupResponsePayloadSchema
