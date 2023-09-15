import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class ListFamilyMembersListenerTest extends AbstractEightBitTest {
	@test()
	protected static async isListening() {
		await this.bootSkill()
		await this.fakedClient.emitAndFlattenResponses(
			'eightbitstories.list-family-members::v2023_09_05'
		)
	}
}
