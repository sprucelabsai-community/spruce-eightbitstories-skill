import { buildSchema } from '@sprucelabs/schema'

export default buildSchema({
	id: 'story',
	name: 'Story',
	fields: {
		id: {
			type: 'id',
			isRequired: true,
		},
		dateGenerated: {
			type: 'dateTime',
			isRequired: true,
		},
		body: {
			type: 'text',
			isRequired: true,
		},
	},
})
