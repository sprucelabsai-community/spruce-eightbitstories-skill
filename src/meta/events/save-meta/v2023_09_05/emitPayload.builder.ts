import { buildSchema, dropFields } from '@sprucelabs/schema'
import metaBuilder from '../../../../schemas/v2023_09_05/meta.builder'

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
						...dropFields(metaBuilder.fields, ['id']),
					},
				}),
			},
		},
	},
})

export default saveMetaEmitPayloadBuilder
