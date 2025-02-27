import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, assert, generateId } from '@sprucelabs/test-utils'
import Onboarding from '../../../onboarding/Onboarding'
import RemoteStoreImpl, {
    RemoteStore,
    SaveMetaOptions,
} from '../../../RemoteStore'
import RootSkillViewController from '../../../skillViewControllers/Root.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
@suite()
export default class RootHandlingOnboardingTest extends AbstractEightBitTest {
    private vc!: RootSkillViewController
    private onboardingName!: string
    private onboardingValues!: string

    protected async beforeEach() {
        await super.beforeEach()

        Onboarding.clear()
        RemoteStoreImpl.Class = MockRemoteStore

        this.onboardingName = generateId()
        this.onboardingValues = generateId()

        this.vc = this.views.Controller('eightbitstories.root', {})

        await this.eventFaker.fakeGetMmpSetup()

        this.setupOnboarding()
    }

    @test()
    protected async loginIsNotRequiredByDefault() {
        this.clearOnboarding()
        await this.assertLoginIsNotRequired()
    }

    @test()
    protected async requiresLoginIfOnboardingIsSetup() {
        await this.assertLoginRequired()
    }

    @test()
    protected async savesMetaDataIfInOnboardingOnLoad() {
        const expected = {
            name: this.onboarding.name,
            values: this.onboarding.values,
        }

        await this.loadAndAssertRedirect()
        MockRemoteStore.instance.assertSaveMetaCalledWith(expected)
    }

    @test()
    protected async redirectToMembersIfOnboarding() {
        await this.loadAndAssertRedirect()
    }

    @test()
    protected async onboardingIsClearedAfterRedirect() {
        await this.loadAndAssertRedirect()
        assert.isFalse(this.onboarding.isOnboarding)
    }

    @test()
    protected async loadingNotLoggedInAndNotOnboardingRedirectsToOnboarding() {
        await this.permissions.getAuthenticator().clearSession()
        this.clearOnboarding()

        await vcAssert.assertActionRedirects({
            action: () => this.load(),
            destination: {
                id: 'eightbitstories.onboarding',
            },
            router: this.views.getRouter(),
        })
    }

    @test()
    protected async doesNotRedirectIfOnboardingSkipped() {
        this.clearOnboarding()
        this.onboarding.skip()
        await this.load()
        await this.assertLoginIsNotRequired()
    }

    private async assertLoginIsNotRequired() {
        await vcAssert.assertLoginIsNotRequired(this.vc)
    }

    private async assertLoginRequired() {
        await vcAssert.assertLoginIsRequired(this.vc)
    }

    private clearOnboarding() {
        Onboarding.clear()
    }

    private async loadAndAssertRedirect() {
        await vcAssert.assertActionRedirects({
            action: () => this.load(),
            destination: {
                id: 'eightbitstories.members',
            },
            router: this.views.getRouter(),
        })
    }

    private setupOnboarding() {
        const onboarding = Onboarding.getInstance()

        onboarding.set({
            name: this.onboardingName,
            values: this.onboardingValues,
        })
    }

    private get onboarding() {
        return Onboarding.getInstance()
    }

    private async load() {
        await this.views.load(this.vc)
    }
}

class MockRemoteStore implements RemoteStore {
    private static saveMetaOptions?: SaveMetaOptions
    public static instance: MockRemoteStore

    public constructor(_connectToApi: () => Promise<any>) {
        MockRemoteStore.instance = this
    }

    public async saveMeta(options: SaveMetaOptions): Promise<void> {
        MockRemoteStore.saveMetaOptions = options
    }

    public assertSaveMetaCalledWith(expected: Partial<SaveMetaOptions>) {
        assert.isEqualDeep(
            MockRemoteStore.saveMetaOptions,
            expected,
            `Save meta not called with expected options.`
        )
    }
}
