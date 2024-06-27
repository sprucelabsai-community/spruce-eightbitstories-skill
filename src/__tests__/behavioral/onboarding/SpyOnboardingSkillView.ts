import OnboardingSkillViewController from '../../../onboarding/Onboarding.svc'

export default class SpyOnboardingSkillView extends OnboardingSkillViewController {
    public getSwipeVc() {
        return this.swipeVc
    }

    public getNameFormVc() {
        return this.nameFormVc
    }

    public getValuesFormVc() {
        return this.valuesFormVc
    }
}
