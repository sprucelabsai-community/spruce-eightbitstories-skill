import {
	buttonAssert,
	interactor,
	vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import GenerateSkillViewController from '../../../skillViewControllers/Generate.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class GenerateSkillViewTest extends AbstractEightBitTest {
	private static vc: SpyGenerateSkillView
	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()
		this.views.setController('eightbitstories.generate', SpyGenerateSkillView)
		this.vc = this.views.Controller(
			'eightbitstories.generate',
			{}
		) as SpyGenerateSkillView
	}

	@test()
	protected static async rendersExpectedCards() {
		vcAssert.assertSkillViewRendersCards(this.vc, [
			'elements',
			'members',
			'controls',
		])
	}

	@test()
	protected static async controlsCardRendersExpectedButtons() {
		buttonAssert.cardRendersButtons(this.controlsVc, ['back', 'generate'])
	}

	@test()
	protected static async clickingBackGoesBackToRoot() {
		await this.views.load(this.vc)

		await vcAssert.assertActionRedirects({
			action: () => interactor.clickButton(this.controlsVc, 'back'),
			destination: {
				id: 'eightbitstories.root',
			},
			router: this.views.getRouter(),
		})
	}

	private static get controlsVc() {
		return this.vc.getControlsCardVc()
	}
}

class SpyGenerateSkillView extends GenerateSkillViewController {
	public getControlsCardVc() {
		return this.controlsVc
	}
}
