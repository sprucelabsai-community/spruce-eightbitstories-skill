import {
	formAssert,
	interactor,
	vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { eventFaker, fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import {
	AddFamilyMember,
	PublicFamilyMember,
} from '../../../eightbitstories.types'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import { AddMemberTargetAndPayload } from '../../support/EventFaker'
import SpyFamilyMemberCard from './SpyFamilyMemberCard'

@fake.login()
export default class FamilyMemberFormCardTest extends AbstractEightBitTest {
	private static vc: SpyFamilyMemberCard
	private static lastAddedMember?: PublicFamilyMember

	protected static async beforeEach() {
		await super.beforeEach()

		delete this.lastAddedMember

		this.views.setController(
			'eightbitstories.family-member-form-card',
			SpyFamilyMemberCard
		)
		this.vc = this.views.Controller('eightbitstories.family-member-form-card', {
			onCancel: () => {},
			onAdd: (member: PublicFamilyMember) => {
				this.lastAddedMember = member
			},
		}) as SpyFamilyMemberCard
	}

	@test()
	protected static async cardRendersForm() {
		formAssert.cardRendersForm(this.vc)
	}

	@test()
	protected static async formRendersExpectedFields() {
		formAssert.formRendersFields(this.formVc, ['name', 'bio'])
	}

	@test()
	protected static async errorSubmittingRendersAlert() {
		await eventFaker.makeEventThrow(
			'eightbitstories.add-family-member::v2023_09_05'
		)

		await vcAssert.assertRendersAlert(this.vc, () => this.submitRandomValues())
	}

	@test()
	protected static async passesExpectedPayloadToAddEvent() {
		let passedPayload: AddMemberTargetAndPayload['payload'] | undefined

		await this.eventFaker.fakeAddFamilyMember(({ payload }) => {
			passedPayload = payload
		})

		await this.submitRandomValues()

		assert.isEqualDeep(passedPayload?.familyMember, this.getValues())
	}

	@test()
	protected static async onAddHandlerCalledWithMemberFromResponseToAddEvent() {
		const values: PublicFamilyMember = {
			id: generateId(),
			name: generateId(),
			bio: generateId(),
		}

		await this.eventFaker.fakeAddFamilyMember(() => {
			return values
		})

		await this.submitRandomValues()

		assert.isEqualDeep(this.lastAddedMember, values)
	}

	private static async submitRandomValues() {
		await this.fillOutFormWithRandomValues()
		await this.submitForm()
	}

	private static submitForm(): any {
		return interactor.submitForm(this.formVc)
	}

	private static async fillOutFormWithRandomValues() {
		await this.vc.fillOutRandomly()
	}

	private static get formVc() {
		return this.vc.getFormVc()
	}

	private static getValues() {
		return this.formVc.getValues() as AddFamilyMember
	}
}
