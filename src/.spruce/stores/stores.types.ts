import MetaStore from '../../meta/Meta.store'
import StoriesStore from '../../story/Stories.store'
import FamilyMembersStore from '../../members/FamilyMembers.store'

declare module '@sprucelabs/data-stores/build/types/stores.types' {
	interface StoreMap {
                meta: MetaStore
                stories: StoriesStore
                familyMembers: FamilyMembersStore
	}

	interface StoreOptionsMap {
                meta: Omit<Parameters<typeof MetaStore['Store']>[0], keyof UniversalStoreOptions>   
                stories: Omit<Parameters<typeof StoriesStore['Store']>[0], keyof UniversalStoreOptions>   
                familyMembers: Omit<Parameters<typeof FamilyMembersStore['Store']>[0], keyof UniversalStoreOptions>   
        }
}