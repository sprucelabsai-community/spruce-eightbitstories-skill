import { SpruceSchemas } from '@sprucelabs/spruce-core-schemas'
import Family from './members/Family'
import MetaTracker from './meta/MetaTracker'

export type Meta = SpruceSchemas.Eightbitstories.v2023_09_05.Meta
export type GetMeta = SpruceSchemas.Eightbitstories.v2023_09_05.GetMeta
export type SaveMeta = SpruceSchemas.Eightbitstories.v2023_09_05.SaveMeta
export type FamilyMemberSchema =
	SpruceSchemas.Eightbitstories.v2023_09_05.FamilyMemberSchema
export type FamilyMember =
	SpruceSchemas.Eightbitstories.v2023_09_05.FamilyMember
export type AddFamilyMember =
	SpruceSchemas.Eightbitstories.v2023_09_05.AddFamilyMember
export type UpdateFamilyMember =
	SpruceSchemas.Eightbitstories.v2023_09_05.UpdateFamilyMember
export type PublicFamilyMember =
	SpruceSchemas.Eightbitstories.v2023_09_05.PublicFamilyMember
export type Story = SpruceSchemas.Eightbitstories.v2023_09_05.Story

declare module '@sprucelabs/spruce-skill-utils/build/types/skill.types' {
	interface SkillContext {
		metas: MetaTracker
		family: Family
	}
}
