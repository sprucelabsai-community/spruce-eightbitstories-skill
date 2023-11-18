import FamilyMembersStore from '../../members/FamilyMembers.store'
import StoriesStore from '../../story/Stories.store'
import MetaStore from '../../meta/Meta.store'

declare module '@sprucelabs/data-stores/build/types/stores.types' {
	interface StoreMap {
                familyMembers: FamilyMembersStore
                stories: StoriesStore
                meta: MetaStore
	}

	interface StoreOptionsMap {
                familyMembers: Omit<Parameters<typeof FamilyMembersStore['Store']>[0], keyof UniversalStoreOptions>   
                stories: Omit<Parameters<typeof StoriesStore['Store']>[0], keyof UniversalStoreOptions>   
                meta: Omit<Parameters<typeof MetaStore['Store']>[0], keyof UniversalStoreOptions>   
        }
}