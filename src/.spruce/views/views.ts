import GenerateSkillViewController from '../../generation/Generate.svc'
import MetaSkillViewController from '../../meta/Meta.svc'
import MembersSkillViewController from '../../members/Members.svc'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import StorySkillViewController from '../../story/Story.svc'
import OnboardingSkillViewController from '../../onboarding/Onboarding.svc'
import FeedbackCardViewController from '../../feedback/FeedbackCard.vc'
import FamilyMemberFormCardViewController from '../../members/FamilyMemberFormCard.vc'
import AdjustMmpVcPlugin from '../../viewPlugins/mmp.view.plugin'

import '@sprucelabs/heartwood-view-controllers'

const vcs = {
    GenerateSkillViewController,
    MetaSkillViewController,
    MembersSkillViewController,
    RootSkillViewController,
    StorySkillViewController,
    OnboardingSkillViewController,
    FeedbackCardViewController,
    FamilyMemberFormCardViewController,
}

export const pluginsByName = {
	mmp: AdjustMmpVcPlugin,
}

type LoadOptions<Args extends Record<string,any>[]> = Args[0]['args'] extends Record<string, any> ? Args[0]['args'] : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
	interface SkillViewControllerMap {
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.root': RootSkillViewController
		'eightbitstories.story': StorySkillViewController
		'eightbitstories.onboarding': OnboardingSkillViewController
	}

	interface SkillViewControllerArgsMap {
		'eightbitstories.generate': LoadOptions<Parameters<GenerateSkillViewController['load']>>
		'eightbitstories.meta': LoadOptions<Parameters<MetaSkillViewController['load']>>
		'eightbitstories.members': LoadOptions<Parameters<MembersSkillViewController['load']>>
		'eightbitstories.root': LoadOptions<Parameters<RootSkillViewController['load']>>
		'eightbitstories.story': LoadOptions<Parameters<StorySkillViewController['load']>>
		'eightbitstories.onboarding': LoadOptions<Parameters<OnboardingSkillViewController['load']>>
	}

	interface ViewControllerMap {
		'eightbitstories.feedback-card': FeedbackCardViewController
		'eightbitstories.family-member-form-card': FamilyMemberFormCardViewController
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.root': RootSkillViewController
		'eightbitstories.story': StorySkillViewController
		'eightbitstories.onboarding': OnboardingSkillViewController
	}

    interface ViewControllerOptionsMap {
		'eightbitstories.feedback-card': ConstructorParameters<typeof FeedbackCardViewController>[0]
		'eightbitstories.family-member-form-card': ConstructorParameters<typeof FamilyMemberFormCardViewController>[0]
	}

	interface ViewControllerPlugins {
		mmp: AdjustMmpVcPlugin
	}
}

//@ts-ignore
if(typeof heartwood === 'function') { 
	//@ts-ignore
	heartwood(vcs, pluginsByName) 
}

export default vcs
