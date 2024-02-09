import AbstractEightBitSkillView from './AbstracteightBitSkillView'

export default abstract class AbstractLoggedInEightBitSkillView extends AbstractEightBitSkillView {
	public async getIsLoginRequired() {
		return true
	}
}
