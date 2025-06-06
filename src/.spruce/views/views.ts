import MembersSkillViewController from '../../members/Members.svc'
import GenerateSkillViewController from '../../generation/Generate.svc'
import MetaSkillViewController from '../../meta/Meta.svc'
import OnboardingSkillViewController from '../../onboarding/Onboarding.svc'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import StorySkillViewController from '../../story/Story.svc'
import FeedbackCardViewController from '../../feedback/FeedbackCard.vc'
import FamilyMemberFormCardViewController from '../../members/FamilyMemberFormCard.vc'
import AdjustMmpVcPlugin from '../../viewPlugins/mmp.view.plugin'

import '@sprucelabs/heartwood-view-controllers'

const vcs = {
    MembersSkillViewController,
    GenerateSkillViewController,
    MetaSkillViewController,
    OnboardingSkillViewController,
    RootSkillViewController,
    StorySkillViewController,
    FeedbackCardViewController,
    FamilyMemberFormCardViewController,
}

export const pluginsByName = {
	mmp: AdjustMmpVcPlugin,
}



type LoadOptions<Args extends Record<string,any>[]> = Args[0]['args'] extends Record<string, any> ? Args[0]['args'] : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
	interface SkillViewControllerMap {
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.onboarding': OnboardingSkillViewController
		'eightbitstories.root': RootSkillViewController
		'eightbitstories.story': StorySkillViewController
	}

	interface SkillViewControllerArgsMap {
		'eightbitstories.members': LoadOptions<Parameters<MembersSkillViewController['load']>>
		'eightbitstories.generate': LoadOptions<Parameters<GenerateSkillViewController['load']>>
		'eightbitstories.meta': LoadOptions<Parameters<MetaSkillViewController['load']>>
		'eightbitstories.onboarding': LoadOptions<Parameters<OnboardingSkillViewController['load']>>
		'eightbitstories.root': LoadOptions<Parameters<RootSkillViewController['load']>>
		'eightbitstories.story': LoadOptions<Parameters<StorySkillViewController['load']>>
	}

	interface ViewControllerMap {
		'eightbitstories.feedback-card': FeedbackCardViewController
		'eightbitstories.family-member-form-card': FamilyMemberFormCardViewController
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.onboarding': OnboardingSkillViewController
		'eightbitstories.root': RootSkillViewController
		'eightbitstories.story': StorySkillViewController
	}

    interface ViewControllerOptionsMap {
		'eightbitstories.feedback-card': ConstructorParameters<typeof FeedbackCardViewController>[0]
		'eightbitstories.family-member-form-card': ConstructorParameters<typeof FamilyMemberFormCardViewController>[0]
	}

	interface ViewControllerPlugins {
		mmp: AdjustMmpVcPlugin
	}

	interface AppControllerMap {
	}
}


//@ts-ignore
if(typeof heartwood === 'function') { 
	//@ts-ignore
	heartwood({ vcs, pluginsByName }) 
}

export default vcs


export const App = undefined
