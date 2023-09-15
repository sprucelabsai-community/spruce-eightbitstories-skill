import { generateId } from '@sprucelabs/test-utils'
import FamilyMemberFormCardViewController from '../../../members/FamilyMemberFormCard.vc'

export default class SpyFamilyMemberCard extends FamilyMemberFormCardViewController {
	public getFormVc() {
		return this.formVc
	}

	public async fillOutRandomly() {
		await this.formVc.setValues({
			name: generateId(),
			bio: generateId(),
		})

		return this.formVc.getValues()
	}
}
