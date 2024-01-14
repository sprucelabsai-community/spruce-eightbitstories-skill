import { Schema } from '@sprucelabs/schema'
import { FormCardViewController } from '@sprucelabs/spruce-form-utils'

export default class FormGettingVc<
	S extends Schema,
> extends FormCardViewController<S> {
	public getFormVc() {
		return this.formVc
	}
}
