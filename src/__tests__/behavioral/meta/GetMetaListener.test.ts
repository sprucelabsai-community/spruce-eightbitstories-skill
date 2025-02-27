import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, assert, generateId } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
@suite()
export default class GetMetaListenerTest extends AbstractEightBitTest {
    protected async beforeEach() {
        await super.beforeEach()
        await this.bootSkill()
    }

    @test()
    protected async returnsEmptyMetaIfNoneSaved() {
        await this.assertReturnsNoMeta()
    }

    @test()
    protected async returnsSavedMeta() {
        const expected = await this.seedMetaForPerson(this.fakedPerson.id)
        const actual = await this.emitGetMeta()

        //@ts-ignore
        delete expected.target

        assert.isEqualDeep(actual, expected)
    }

    @test()
    protected async matchesTargetWhenGettingMeta() {
        await this.seedMetaForPerson(generateId())
        await this.assertReturnsNoMeta()
    }

    private async assertReturnsNoMeta() {
        const meta = await this.emitGetMeta()
        assert.isFalsy(meta)
    }

    private async seedMetaForPerson(personId: string) {
        const expected = this.eventFaker.generateRandomMetaWithTarget(personId)
        await this.metas.createOne(expected)
        return expected
    }

    private async emitGetMeta() {
        const [results] = await this.fakedClient.emitAndFlattenResponses(
            'eightbitstories.get-meta::v2023_09_05'
        )

        return results?.meta
    }
}
