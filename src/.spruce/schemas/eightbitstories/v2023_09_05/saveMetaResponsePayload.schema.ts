import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import metaSchema_v2023_09_05 from '#spruce/schemas/eightbitstories/v2023_09_05/meta.schema'

const saveMetaResponsePayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.SaveMetaResponsePayloadSchema  = {
	id: 'saveMetaResponsePayload',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: '',
	    fields: {
	            /** . */
	            'meta': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: metaSchema_v2023_09_05,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(saveMetaResponsePayloadSchema)

export default saveMetaResponsePayloadSchema
