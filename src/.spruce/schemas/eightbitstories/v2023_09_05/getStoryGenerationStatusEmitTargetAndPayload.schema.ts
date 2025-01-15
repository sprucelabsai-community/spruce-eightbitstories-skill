import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import eventSourceSchema_v2021_09_13 from '#spruce/schemas/spruceEventUtils/v2021_09_13/eventSource.schema'
import getStoryGenerationStatusEmitTargetSchema_v2023_09_05 from '#spruce/schemas/eightbitstories/v2023_09_05/getStoryGenerationStatusEmitTarget.schema'

const getStoryGenerationStatusEmitTargetAndPayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.GetStoryGenerationStatusEmitTargetAndPayloadSchema  = {
	id: 'getStoryGenerationStatusEmitTargetAndPayload',
	version: 'v2023_09_05',
	namespace: 'Eightbitstories',
	name: '',
	    fields: {
	            /** Source. */
	            'source': {
	                label: 'Source',
	                type: 'schema',
	                options: {schema: eventSourceSchema_v2021_09_13,}
	            },
	            /** . */
	            'target': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: getStoryGenerationStatusEmitTargetSchema_v2023_09_05,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(getStoryGenerationStatusEmitTargetAndPayloadSchema)

export default getStoryGenerationStatusEmitTargetAndPayloadSchema
