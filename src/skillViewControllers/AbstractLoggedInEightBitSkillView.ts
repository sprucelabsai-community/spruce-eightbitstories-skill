import AbstractEightBitSkillView from './AbstractEightBitSkillView'

export default abstract class AbstractLoggedInEightBitSkillView extends AbstractEightBitSkillView {
	public async getIsLoginRequired() {
		return true
	}
}
