import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, generateId, assert } from '@sprucelabs/test-utils'
import { AddFamilyMember } from '../../../eightbitstories.types'
import FamilyMembersStore from '../../../members/FamilyMembers.store'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class AddFamilyMemberListenerTest extends AbstractEightBitTest {
	private static member: AddFamilyMember
	private static members: FamilyMembersStore

	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()
		this.members = await this.stores.getStore('familyMembers')
		this.member = {
			name: generateId(),
			bio: generateId(),
		}
		await this.bootSkill()
	}

	@test()
	protected static async canCreateAddFamilyMemberListener() {
		await this.emitAddFamilyMember()
	}

	@test()
	protected static async addingFamilyMemberCreatesMemberRecord() {
		await this.emitAddFamilyMember()

		const count = await this.members.count()
		assert.isEqual(count, 1)
	}

	@test()
	protected static async savesExpectedValues() {
		await this.emitAddFamilyMember()
		const match = await this.getFirstFamilyMember()

		assert.doesInclude(match, this.member)
		assert.isEqualDeep(match?.target, {
			personId: this.fakedPerson.id,
		})
	}

	@test()
	protected static async returnsExpectedPayload() {
		const familyMember = await this.emitAddFamilyMember()
		const match = await this.getFirstFamilyMember()
		assert.doesInclude(match, familyMember)
	}

	private static async getFirstFamilyMember() {
		return await this.members.findOne({}, { shouldIncludePrivateFields: true })
	}

	private static async emitAddFamilyMember() {
		const [{ familyMember }] = await this.fakedClient.emitAndFlattenResponses(
			'eightbitstories.add-family-member::v2023_09_05',
			{
				payload: {
					familyMember: this.member,
				},
			}
		)

		return familyMember
	}
}
