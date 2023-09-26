import {
	FormViewController,
	buttonAssert,
	formAssert,
	interactor,
	vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { selectAssert } from '@sprucelabs/schema'
import { SelectChoice } from '@sprucelabs/spruce-core-schemas'
import { FormCardViewController } from '@sprucelabs/spruce-form-utils'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { assert, test } from '@sprucelabs/test-utils'
import GenerateSkillViewController, {
	GenerateStorySchema,
	storyElements,
} from '../../../skillViewControllers/Generate.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class GenerateSkillViewTest extends AbstractEightBitTest {
	private static vc: SpyGenerateSkillView
	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()
		this.views.setController('eightbitstories.generate', SpyGenerateSkillView)
		this.views.setController('forms.card', SpyFormCard)

		this.vc = this.views.Controller(
			'eightbitstories.generate',
			{}
		) as SpyGenerateSkillView

		await this.eventFaker.fakeListFamilyMembers(() => this.members.find({}))
	}

	@test()
	protected static async requiresLogin() {
		await vcAssert.assertLoginIsRequired(this.vc)
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
		await this.loadVc()

		await vcAssert.assertActionRedirects({
			action: () => interactor.clickButton(this.controlsVc, 'back'),
			destination: {
				id: 'eightbitstories.root',
			},
			router: this.views.getRouter(),
		})
	}

	@test()
	protected static elementsAndMembersCardsRendersForms() {
		formAssert.cardRendersForm(this.elementsVc)
		formAssert.cardRendersForm(this.membersVc)
	}

	@test()
	protected static async formCardsDoNotRenderButtons() {
		assert.isFalse(this.elementsFormVc.getShouldRenderSubmitControls())
		assert.isFalse(this.membersFormVc.getShouldRenderSubmitControls())
	}

	@test()
	protected static async elementsFormRendersExpectedFields() {
		formAssert.formRendersFields(this.elementsFormVc, ['elements'])
	}

	@test()
	protected static async elementsFormRendersExpectedChoices() {
		const schema = this.elementsFormVc.getSchema()
		selectAssert.assertSelectChoicesMatch(
			schema.fields.elements.options.choices,
			storyElements.map((element) => element.id)
		)
	}

	@test()
	protected static async rendersElementsAsTags() {
		formAssert.formFieldRendersAs(this.elementsFormVc, 'elements', 'tags')
	}

	@test()
	protected static async membersFormRendersExpectedFields() {
		formAssert.formRendersFields(this.membersFormVc, ['members'])
	}

	@test()
	protected static async membersFormRendersAsTags() {
		formAssert.formFieldRendersAs(this.membersFormVc, 'members', 'tags')
	}

	@test()
	@seed('familyMembers', 3)
	protected static async membersRendersExpectedChoices() {
		const members = await this.members.find({})
		const expected = members.map((member) => member.id)
		await this.loadVc()
		const schema = this.membersFormVc.getSchema()
		selectAssert.assertSelectChoicesMatch(
			schema.fields.members.options.choices as SelectChoice[],
			expected
		)
	}

	private static get membersFormVc() {
		return this.vc.getMembersFormVc()
	}

	private static get elementsFormVc() {
		return this.vc.getElementsFormVc()
	}

	private static async loadVc() {
		await this.views.load(this.vc)
	}

	private static get membersVc() {
		return this.vc.getMembersVc()
	}

	private static get elementsVc() {
		return this.vc.getElementsVc()
	}

	private static get controlsVc() {
		return this.vc.getControlsCardVc()
	}
}

class SpyGenerateSkillView extends GenerateSkillViewController {
	public getMembersFormVc() {
		return this.getMembersVc().getFormVc() as FormViewController<GenerateStorySchema>
	}
	public getElementsFormVc() {
		return this.getElementsVc().getFormVc() as FormViewController<GenerateStorySchema>
	}
	public getElementsVc() {
		return this.elementsVc as SpyFormCard
	}
	public getMembersVc() {
		return this.membersVc as SpyFormCard
	}
	public getControlsCardVc() {
		return this.controlsVc
	}
}

class SpyFormCard extends FormCardViewController {
	public getFormVc() {
		return this.formVc
	}
}
