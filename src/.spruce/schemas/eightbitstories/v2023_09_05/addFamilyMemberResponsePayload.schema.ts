import { SchemaRegistry } from '@sprucelabs/schema'
import publicFamilyMemberSchema_v2023_09_05 from '#spruce/schemas/eightbitstories/v2023_09_05/publicFamilyMember.schema'
import { SpruceSchemas } from '../../schemas.types'

const addFamilyMemberResponsePayloadSchema: SpruceSchemas.Eightbitstories.v2023_09_05.AddFamilyMemberResponsePayloadSchema =
    {
        id: 'addFamilyMemberResponsePayload',
        version: 'v2023_09_05',
        namespace: 'Eightbitstories',
        name: '',
        fields: {
            /** . */
            familyMember: {
                type: 'schema',
                isRequired: true,
                options: { schema: publicFamilyMemberSchema_v2023_09_05 },
            },
        },
    }

SchemaRegistry.getInstance().trackSchema(addFamilyMemberResponsePayloadSchema)

export default addFamilyMemberResponsePayloadSchema
