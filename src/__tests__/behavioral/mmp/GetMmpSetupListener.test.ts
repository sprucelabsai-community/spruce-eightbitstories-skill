import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class GetMmpSetupListenerTest extends AbstractEightBitTest {
    protected static async beforeEach() {
        await super.beforeEach()
        process.env.ADJUST_APP_TOKEN = generateId()
        process.env.ADJUST_ENVIRONMENT = generateId()
    }

    @test()
    protected static async skillIsListening() {
        await this.bootSkill()

        const [{ appToken, environment }] =
            await this.fakedClient.emitAndFlattenResponses(
                'eightbitstories.get-mmp-setup::v2023_09_05'
            )

        assert.isEqual(appToken, process.env.ADJUST_APP_TOKEN)
        assert.isEqual(environment, process.env.ADJUST_ENVIRONMENT)
    }
}
