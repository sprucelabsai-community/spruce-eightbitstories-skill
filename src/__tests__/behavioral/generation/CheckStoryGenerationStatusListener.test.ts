import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class CheckStoryGenerationStatusListenerTest extends AbstractEightBitTest {
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        await this.bootSkill()
    }

    @test()
    protected static async skillIsListening() {
        await this.emit()
    }

    @test()
    @seed('stories', 1)
    protected static async returnsGeneratingStatusIfNotFound() {
        const { status } = await this.emit()
        assert.isEqual(status, 'generating')
    }

    @test()
    @seed('stories', 1)
    protected static async returnsProperStatusIfStoryFound() {
        const story = await this.getFirstGeneratedStory()
        const { status, storyId } = await this.emit(story.source.hash)
        assert.isEqual(status, 'ready')
        assert.isEqual(storyId, story.id)
    }

    private static async emit(storyHash?: string) {
        const [results] = await this.fakedClient.emitAndFlattenResponses(
            'eightbitstories.get-story-generation-status::v2023_09_05',
            {
                target: {
                    storyHash: storyHash ?? generateId(),
                },
            }
        )

        return results
    }
}
