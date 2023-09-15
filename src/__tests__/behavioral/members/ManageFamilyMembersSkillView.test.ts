import {
	buttonAssert,
	interactor,
	listAssert,
	vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import MembersSkillViewController from '../../../members/Members.svc'
import FamilyMemberFormCardViewController from '../../../members/FamilyMemberFormCard.vc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import SpyFamilyMemberCard from './SpyFamilyMemberCard'

@fake.login()
export default class ManageFamilyMembersSkillViewTest extends AbstractEightBitTest {
	private static vc: SpyMembersSkillView

	protected static async beforeEach() {
		await super.beforeEach()
		this.views.setController('eightbitstories.members', SpyMembersSkillView)
		this.views.setController(
			'eightbitstories.family-member-form-card',
			SpyFamilyMemberCard
		)
		this.vc = this.views.Controller(
			'eightbitstories.members',
			{}
		) as SpyMembersSkillView
	}

	@test()
	protected static viewRendersCard() {
		vcAssert.assertSkillViewRendersCard(this.vc)
	}

	@test()
	protected static async cardRendersList() {
		listAssert.cardRendersList(this.cardVc)
	}

	@test()
	protected static async listRendersNoResultsRowToStart() {
		listAssert.listRendersRow(this.vc.getListVc(), 'no-results')
	}

	@test()
	protected static async cardRendersAddAndBackButtons() {
		buttonAssert.cardRendersButtons(this.cardVc, ['add', 'back'])
	}

	@test()
	protected static async clickingBackRedirectsToRoot() {
		await this.views.load(this.vc)

		await vcAssert.assertActionRedirects({
			action: () => this.clickButton('back'),
			router: this.views.getRouter(),
			destination: {
				id: 'eightbitstories.root',
			},
		})
	}

	@test()
	protected static async clickingAddMemberRendersDialog() {
		const { familyVc, dialogVc } = await this.clickAddAndAssertRendersFormCard()
		await interactor.cancelForm(familyVc.getFormVc())
		assert.isFalse(dialogVc.getIsVisible())
	}

	@test()
	protected static async addingMemberHidesDialog() {
		await this.eventFaker.fakeAddFamilyMember()
		const { familyVc, dialogVc } = await this.clickAddAndAssertRendersFormCard()
		await familyVc.fillOutRandomly()
		await interactor.submitForm(familyVc.getFormVc())
		assert.isFalse(dialogVc.getIsVisible())
	}

	private static async clickAddAndAssertRendersFormCard() {
		const dialogVc = await vcAssert.assertRendersDialog(this.vc, () =>
			this.clickButton('add')
		)
		const familyVc = vcAssert.assertRendersAsInstanceOf(
			dialogVc,
			FamilyMemberFormCardViewController
		)
		return { familyVc: familyVc as SpyFamilyMemberCard, dialogVc }
	}

	private static clickButton(button: string): any {
		return interactor.clickButton(this.cardVc, button)
	}

	private static get cardVc() {
		return this.vc.getCardVc()
	}
}

class SpyMembersSkillView extends MembersSkillViewController {
	public getListVc() {
		return this.listVc
	}
	public getCardVc() {
		return this.cardVc
	}
}
