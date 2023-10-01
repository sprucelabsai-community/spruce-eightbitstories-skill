import { AbstractSkillViewController } from '@sprucelabs/heartwood-view-controllers'

export default abstract class AbstractEightBitSkillView extends AbstractSkillViewController {
	public async getIsLoginRequired() {
		return true
	}

	public renderNavigation() {
		return null
	}
}
