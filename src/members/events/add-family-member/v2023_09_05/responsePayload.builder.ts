import { buildSchema } from '@sprucelabs/schema'
import publicFamilyMemberBuilder from '../../../publicFamilyMember.builder'

const addFamilyMemberResponsePayloadBuilder = buildSchema({
	id: 'addFamilyMemberResponsePayload',
	fields: {
		familyMember: {
			type: 'schema',
			isRequired: true,
			options: {
				schema: publicFamilyMemberBuilder,
			},
		},
	},
})

export default addFamilyMemberResponsePayloadBuilder
