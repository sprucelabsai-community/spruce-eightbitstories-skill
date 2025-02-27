import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { assert, generateId } from '@sprucelabs/test-utils'
import { FamilyMember } from '../../eightbitstories.types'
import FamilyMembersStore from '../../members/FamilyMembers.store'
import MetaStore from '../../meta/Meta.store'
import StoriesStore from '../../story/Stories.store'
import EventFaker from './EventFaker'

process.env.OPENAI_API_KEY = generateId()

export default abstract class AbstractEightBitTest extends AbstractSpruceFixtureTest {
    protected eventFaker!: EventFaker
    protected metas!: MetaStore
    protected members!: FamilyMembersStore
    protected stories!: StoriesStore

    protected async beforeEach() {
        await super.beforeEach()
        this.eventFaker = new EventFaker()
        this.metas = await this.stores.getStore('meta')
        this.members = await this.stores.getStore('familyMembers')
        this.stories = await this.stores.getStore('stories')
    }

    public async getSecondFamilyMember() {
        const all = await this.members.find({})
        return all[1]
    }

    protected async getFirstFamilyMember(
        options: { shouldIncludePrivateFields?: boolean } = {}
    ) {
        const { shouldIncludePrivateFields } = options
        const match = await this.members.findOne(
            {},
            { shouldIncludePrivateFields: shouldIncludePrivateFields ?? true }
        )
        assert.isTruthy(
            match,
            `You gotta @seed('familyMembers', 1) to get your first family member`
        )

        return match as FamilyMember
    }

    protected async getFirstGeneratedStory() {
        const story = await this.stories.findOne(
            {},
            { shouldIncludePrivateFields: true }
        )
        assert.isTruthy(story)
        return story
    }
}
