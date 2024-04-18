import FamilyMembersStore from '../../members/FamilyMembers.store'
import MetaStore from '../../meta/Meta.store'
import StoriesStore from '../../story/Stories.store'

declare module '@sprucelabs/data-stores/build/types/stores.types' {
    interface StoreMap {
        familyMembers: FamilyMembersStore
        meta: MetaStore
        stories: StoriesStore
    }

    interface StoreOptionsMap {
        familyMembers: Omit<
            Parameters<(typeof FamilyMembersStore)['Store']>[0],
            keyof UniversalStoreOptions
        >
        meta: Omit<
            Parameters<(typeof MetaStore)['Store']>[0],
            keyof UniversalStoreOptions
        >
        stories: Omit<
            Parameters<(typeof StoriesStore)['Store']>[0],
            keyof UniversalStoreOptions
        >
    }
}
