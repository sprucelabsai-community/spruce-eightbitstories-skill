import { buildSchema } from '@sprucelabs/schema'
import publicFamilyMemberBuilder from '../../../publicFamilyMember.builder'

const listFamilyMembersResponsePayloadBuilder = buildSchema({
	id: 'listFamilyMembersResponsePayload',
	fields: {
		familyMembers: {
			type: 'schema',
			isRequired: true,
			isArray: true,
			minArrayLength: 0,
			options: {
				schema: publicFamilyMemberBuilder,
			},
		},
	},
})

export default listFamilyMembersResponsePayloadBuilder
