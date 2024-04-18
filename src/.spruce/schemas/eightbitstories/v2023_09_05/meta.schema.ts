import { SchemaRegistry } from '@sprucelabs/schema'
import metaTargetSchema_v2023_09_05 from '#spruce/schemas/eightbitstories/v2023_09_05/metaTarget.schema'
import { SpruceSchemas } from '../../schemas.types'

const metaSchema: SpruceSchemas.Eightbitstories.v2023_09_05.MetaSchema = {
    id: 'meta',
    version: 'v2023_09_05',
    namespace: 'Eightbitstories',
    name: 'Meta',
    fields: {
        /** . */
        id: {
            type: 'id',
            isPrivate: true,
            isRequired: true,
            options: undefined,
        },
        /** Family Name. */
        name: {
            label: 'Family Name',
            type: 'text',
            isRequired: true,
            options: undefined,
        },
        /** Your Values. */
        values: {
            label: 'Your Values',
            type: 'text',
            isRequired: true,
            options: undefined,
        },
        /** . */
        target: {
            type: 'schema',
            isPrivate: true,
            isRequired: true,
            options: { schema: metaTargetSchema_v2023_09_05 },
        },
    },
}

SchemaRegistry.getInstance().trackSchema(metaSchema)

export default metaSchema
