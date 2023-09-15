import { SimpleStoreFactory } from '@sprucelabs/data-stores'
import { AddFamilyMember } from '../eightbitstories.types'
import FamilyMembersStore from './FamilyMembers.store'

export default class Family {
	protected constructor(protected readonly members: FamilyMembersStore) {}

	public static async Family(stores: SimpleStoreFactory) {
		const members = await stores.getStore('familyMembers')
		return new this(members)
	}

	public async addMember(personId: string, values: AddFamilyMember) {
		return this.members.createOne({
			...values,
			target: {
				personId,
			},
		})
	}

	public async listMembers(personId: string) {
		return this.members.find({
			//@ts-ignore
			'target.personId': personId,
		})
	}
}
