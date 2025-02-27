import { vcPluginAssert } from '@sprucelabs/heartwood-view-controllers'
import { AdjustMmpVcPlugin, mmpAssert } from '@sprucelabs/spruce-mmp-vc-plugin'
import { eventFaker, fake } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, generateId } from '@sprucelabs/test-utils'
import RootSkillViewController from '../../../skillViewControllers/Root.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
@suite()
export default class AdjustMmpTest extends AbstractEightBitTest {
    private vc!: RootSkillViewController

    protected async beforeEach() {
        await super.beforeEach()

        this.vc = this.views.Controller('eightbitstories.root', {})
        mmpAssert.beforeEach(this.views.getFactory())
    }

    @test()
    protected async autoLogoutPluginInstalled() {
        vcPluginAssert.pluginIsInstalled(this.vc, 'mmp', AdjustMmpVcPlugin)
    }

    @test()
    protected async adjustIsConfiguredOnLoad() {
        const appToken = generateId()
        const environment = generateId()

        await this.eventFaker.fakeGetMmpSetup(() => {
            return {
                appToken,
                environment,
            }
        })

        await mmpAssert.pluginIsSetup({
            action: () => this.load(),
            partner: 'adjust',
            setupOptions: {
                appToken,
                environment,
            },
        })
    }

    @test()
    protected async gettingMmpThrowingDoesNotThrowError() {
        await eventFaker.makeEventThrow(
            'eightbitstories.get-mmp-setup::v2023_09_05'
        )
        await this.load()
    }

    private load(): void | Promise<void> {
        return this.views.load(this.vc)
    }
}
