import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import { SaveMeta } from '../../../eightbitstories.types'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class SaveMetaListenerTest extends AbstractEightBitTest {
	private static meta: SaveMeta

	protected static async beforeEach() {
		await super.beforeEach()
		await this.bootSkill()
		this.meta = this.eventFaker.generateRandomMeta()
	}

	@test()
	protected static async savesMeta() {
		await this.emitSaveMeta()

		const match = await this.metas.findOne(
			{},
			{
				includeFields: ['name', 'values'],
			}
		)
		assert.isEqualDeep(match, this.meta)
	}

	@test()
	protected static async savesOnlyOnceForSamePerson() {
		await this.emitSaveMeta()
		await this.emitSaveMeta()
		const count = await this.metas.count()
		assert.isEqual(count, 1)
	}

	private static async emitSaveMeta() {
		await this.fakedClient.emitAndFlattenResponses(
			'eightbitstories.save-meta::v2023_09_05',
			{
				payload: {
					meta: this.meta,
				},
			}
		)
	}
}
