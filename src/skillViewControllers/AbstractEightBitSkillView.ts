import {
    AbstractSkillViewController,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import Onboarding from '../onboarding/Onboarding'
import RemoteStoreImpl, { RemoteStore } from '../RemoteStore'

export default abstract class AbstractEightBitSkillView extends AbstractSkillViewController {
    protected remote: RemoteStore
    public constructor(options: ViewControllerOptions) {
        super(options)
        this.remote = RemoteStoreImpl.Store(options.connectToApi)
    }

    public renderNavigation() {
        return null
    }

    protected get onboarding() {
        return Onboarding.getInstance()
    }
}
