import { buildSchema, dropPrivateFields } from '@sprucelabs/schema'
import metaBuilder from '../../../meta.builder'

const getMetaResponsePayloadBuilder = buildSchema({
	id: 'getMetaResponsePayload',
	fields: {
		meta: {
			type: 'schema',
			options: {
				schema: buildSchema({
					id: 'getMeta',
					fields: {
						...dropPrivateFields(metaBuilder.fields),
					},
				}),
			},
		},
	},
})

export default getMetaResponsePayloadBuilder
