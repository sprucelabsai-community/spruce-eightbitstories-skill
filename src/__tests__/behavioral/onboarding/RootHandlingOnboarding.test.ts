import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import Onboarding from '../../../onboarding/Onboarding'
import RemoteStoreImpl, {
	RemoteStore,
	SaveMetaOptions,
} from '../../../RemoteStore'
import RootSkillViewController from '../../../skillViewControllers/Root.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class RootHandlingOnboardingTest extends AbstractEightBitTest {
	private static vc: RootSkillViewController
	private static onboardingName: string
	private static onboardingValues: string

	protected static async beforeEach() {
		await super.beforeEach()

		Onboarding.clear()
		RemoteStoreImpl.Class = MockRemoteStore

		this.onboardingName = generateId()
		this.onboardingValues = generateId()

		this.vc = this.views.Controller('eightbitstories.root', {})

		this.setupOnboarding()
	}

	@test()
	protected static async loginIsNotRequiredByDefault() {
		this.clearOnboarding()
		await this.assertLoginIsNotRequired()
	}

	@test()
	protected static async requiresLoginIfOnboardingIsSetup() {
		await this.assertLoginRequired()
	}

	@test()
	protected static async savesMetaDataIfInOnboardingOnLoad() {
		const expected = {
			name: this.onboarding.name,
			values: this.onboarding.values,
		}

		await this.loadAndAssertRedirect()
		MockRemoteStore.instance.assertSaveMetaCalledWith(expected)
	}

	@test()
	protected static async redirectToMembersIfOnboarding() {
		await this.loadAndAssertRedirect()
	}

	@test()
	protected static async onboardingIsClearedAfterRedirect() {
		await this.loadAndAssertRedirect()
		assert.isFalse(this.onboarding.isOnboarding)
	}

	@test()
	protected static async loadingNotLoggedInAndNotOnboardingRedirectsToOnboarding() {
		this.permissions.getAuthenticator().clearSession()
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
	protected static async doesNotRedirectIfOnboardingSkipped() {
		this.clearOnboarding()
		this.onboarding.skip()
		await this.load()
		await this.assertLoginIsNotRequired()
	}

	private static async assertLoginIsNotRequired() {
		await vcAssert.assertLoginIsNotRequired(this.vc)
	}

	private static async assertLoginRequired() {
		await vcAssert.assertLoginIsRequired(this.vc)
	}

	private static clearOnboarding() {
		Onboarding.clear()
	}

	private static async loadAndAssertRedirect() {
		await vcAssert.assertActionRedirects({
			action: () => this.load(),
			destination: {
				id: 'eightbitstories.members',
			},
			router: this.views.getRouter(),
		})
	}

	private static setupOnboarding() {
		const onboarding = Onboarding.getInstance()

		onboarding.set({
			name: this.onboardingName,
			values: this.onboardingValues,
		})
	}

	private static get onboarding() {
		return Onboarding.getInstance()
	}

	private static async load() {
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
