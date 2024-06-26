import { buildSchema } from '@sprucelabs/schema'
import publicFamilyMemberBuilder from '../../../../schemas/v2023_09_05/publicFamilyMember.builder'

const updateFamilyMemberResponsePayloadBuilder = buildSchema({
    id: 'updateFamilyMemberResponsePayload',
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

export default updateFamilyMemberResponsePayloadBuilder
