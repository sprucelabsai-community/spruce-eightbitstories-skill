import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class GetMetaListenerTest extends AbstractEightBitTest {
	protected static async beforeEach() {
		await super.beforeEach()
		await this.bootSkill()
	}

	@test()
	protected static async returnsEmptyMetaIfNoneSaved() {
		const meta = await this.emitGetMeta()
		assert.isFalsy(meta)
	}

	@test()
	protected static async returnsSavedMeta() {
		const expected = this.eventFaker.generateRandomMeta()
		await this.metas.createOne(expected)

		const actual = await this.emitGetMeta()
		assert.isEqualDeep(actual, expected)
	}

	private static async emitGetMeta() {
		const [results] = await this.fakedClient.emitAndFlattenResponses(
			'eightbitstories.get-meta::v2023_09_05'
		)

		return results?.meta
	}
}
