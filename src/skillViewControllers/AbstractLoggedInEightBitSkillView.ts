import AbstractEightBitSkillView from './AbstracEightBitSkillView'

export default abstract class AbstractLoggedInEightBitSkillView extends AbstractEightBitSkillView {
	public async getIsLoginRequired() {
		return true
	}
}
