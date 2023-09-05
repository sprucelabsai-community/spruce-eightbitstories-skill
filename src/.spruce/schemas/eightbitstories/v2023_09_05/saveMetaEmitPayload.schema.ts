import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import metaSchema_v2023_09_05 from '#spruce/schemas/eightbitstories/v2023_09_05/meta.schema'

const saveMetaEmitPayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.SaveMetaEmitPayloadSchema  = {
	id: 'saveMetaEmitPayload',
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

SchemaRegistry.getInstance().trackSchema(saveMetaEmitPayloadSchema)

export default saveMetaEmitPayloadSchema
