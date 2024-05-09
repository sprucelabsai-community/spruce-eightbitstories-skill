import GenerateSkillViewController from '../../generation/Generate.svc'
import MembersSkillViewController from '../../members/Members.svc'
import MetaSkillViewController from '../../meta/Meta.svc'
import OnboardingSkillViewController from '../../onboarding/Onboarding.svc'
import StorySkillViewController from '../../story/Story.svc'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import FeedbackCardViewController from '../../feedback/FeedbackCard.vc'
import FamilyMemberFormCardViewController from '../../members/FamilyMemberFormCard.vc'

import '@sprucelabs/heartwood-view-controllers'

const vcs = {
    GenerateSkillViewController,
    MembersSkillViewController,
    MetaSkillViewController,
    OnboardingSkillViewController,
    StorySkillViewController,
    RootSkillViewController,
    FeedbackCardViewController,
    FamilyMemberFormCardViewController,
}

export const pluginsByName = {
}

type LoadOptions<Args extends Record<string,any>[]> = Args[0]['args'] extends Record<string, any> ? Args[0]['args'] : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
	interface SkillViewControllerMap {
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.onboarding': OnboardingSkillViewController
		'eightbitstories.story': StorySkillViewController
		'eightbitstories.root': RootSkillViewController
	}

	interface SkillViewControllerArgsMap {
		'eightbitstories.generate': LoadOptions<Parameters<GenerateSkillViewController['load']>>
		'eightbitstories.members': LoadOptions<Parameters<MembersSkillViewController['load']>>
		'eightbitstories.meta': LoadOptions<Parameters<MetaSkillViewController['load']>>
		'eightbitstories.onboarding': LoadOptions<Parameters<OnboardingSkillViewController['load']>>
		'eightbitstories.story': LoadOptions<Parameters<StorySkillViewController['load']>>
		'eightbitstories.root': LoadOptions<Parameters<RootSkillViewController['load']>>
	}

	interface ViewControllerMap {
		'eightbitstories.feedback-card': FeedbackCardViewController
		'eightbitstories.family-member-form-card': FamilyMemberFormCardViewController
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.onboarding': OnboardingSkillViewController
		'eightbitstories.story': StorySkillViewController
		'eightbitstories.root': RootSkillViewController
	}

    interface ViewControllerOptionsMap {
		'eightbitstories.feedback-card': ConstructorParameters<typeof FeedbackCardViewController>[0]
		'eightbitstories.family-member-form-card': ConstructorParameters<typeof FamilyMemberFormCardViewController>[0]
	}

	interface ViewControllerPlugins {
	}
}

//@ts-ignore
if(typeof heartwood === 'function') { 
	//@ts-ignore
	heartwood(vcs, pluginsByName) 
}

export default vcs
