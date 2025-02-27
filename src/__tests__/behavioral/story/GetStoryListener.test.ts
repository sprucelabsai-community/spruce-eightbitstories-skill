import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, assert } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
@suite()
export default class GetStoryListenerTest extends AbstractEightBitTest {
    protected async beforeEach(): Promise<void> {
        await super.beforeEach()
        await this.bootSkill()
    }

    @test()
    @seed('stories', 1)
    protected async loadsTheFirstStory() {
        const firstStory = await this.getFirstGeneratedStory()
        const match = await this.emitGetStory(firstStory.id)
        assert.isEqual(match, firstStory.body)
    }

    @test()
    @seed('stories', 2)
    protected async canTellStoriesApart() {
        const [, secondStory] = await this.stories.find({})
        const match = await this.emitGetStory(secondStory.id)
        assert.isEqual(match, secondStory.body)
    }

    private async emitGetStory(storyId: string) {
        const [{ body }] = await this.fakedClient.emitAndFlattenResponses(
            'eightbitstories.get-story::v2023_09_05',
            {
                target: {
                    storyId,
                },
            }
        )
        return body
    }
}
