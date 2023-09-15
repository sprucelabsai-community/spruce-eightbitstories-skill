import { buildSchema, dropPrivateFields } from '@sprucelabs/schema'
import metaBuilder from '../../../meta.builder'

const saveMetaEmitPayloadBuilder = buildSchema({
	id: 'saveMetaEmitPayload',
	fields: {
		meta: {
			type: 'schema',
			isRequired: true,
			options: {
				schema: buildSchema({
					id: 'saveMeta',
					fields: {
						...dropPrivateFields(metaBuilder.fields),
					},
				}),
			},
		},
	},
})

export default saveMetaEmitPayloadBuilder
