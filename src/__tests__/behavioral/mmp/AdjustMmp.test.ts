import {
    vcAssert,
    vcPluginAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { AdjustMmpVcPlugin, mmpAssert } from '@sprucelabs/spruce-mmp-vc-plugin'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import RootSkillViewController from '../../../skillViewControllers/Root.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class AdjustMmpTest extends AbstractEightBitTest {
    private static vc: RootSkillViewController

    protected static async beforeEach() {
        await super.beforeEach()
        this.vc = this.views.Controller('eightbitstories.root', {})
        mmpAssert.beforeEach(this.views.getFactory())
    }

    @test()
    protected static async autoLogoutPluginInstalled() {
        vcPluginAssert.pluginIsInstalled(this.vc, 'mmp', AdjustMmpVcPlugin)
    }

    @test()
    protected static async adjustIsConfiguredOnLoad() {
        let wasHit = false
        await this.eventFaker.fakeGetMmpSetup(() => {
            wasHit = true
        })

        await mmpAssert.pluginIsSetup({
            action: () => this.views.load(this.vc),
            partner: 'adjust',
        })
    }
}
