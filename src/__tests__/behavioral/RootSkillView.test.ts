import { buttonAssert, vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import RootSkillViewController from '../../skillViewControllers/Root.svc'

@fake.login()
export default class RootSkillViewTest extends AbstractSpruceFixtureTest {
	private static vc: RootSkillViewController
	protected static async beforeEach() {
		await super.beforeEach()
		this.vc = this.views.Controller('8-bit-stories.root', {})
	}

	@test()
	protected static async rendersCard() {
		vcAssert.assertSkillViewRendersCard(this.vc, 'controls')
	}

	@test()
	protected static async cardRendersExpectedButtons() {
		buttonAssert.cardRendersButtons(this.vc.cardVc, [
			'members',
			'values',
			'generate',
		])
	}
}
