import { buildSchema } from '@sprucelabs/schema'
import metaBuilder from '../../../schemas/v2023_09_05/meta.builder'

const saveMetaResponsePayloadBuilder = buildSchema({
	id: 'saveMetaResponsePayload',
	fields: {
		meta: {
			type: 'schema',
			isRequired: true,
			options: {
				schema: metaBuilder,
			},
		},
	},
})

export default saveMetaResponsePayloadBuilder
