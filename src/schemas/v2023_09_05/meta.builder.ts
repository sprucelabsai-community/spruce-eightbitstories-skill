import { buildSchema } from '@sprucelabs/schema'

export default buildSchema({
	id: 'meta',
	name: 'Meta',
	fields: {
		name: {
			type: 'text',
			isRequired: true,
			label: 'Family Name',
		},
		values: {
			type: 'text',
			isRequired: true,
			label: 'Values',
		},
	},
})
