import FeedbackCardViewController from '../../feedback/FeedbackCard.vc'
import GenerateSkillViewController from '../../generation/Generate.svc'
import FamilyMemberFormCardViewController from '../../members/FamilyMemberFormCard.vc'
import MembersSkillViewController from '../../members/Members.svc'
import MetaSkillViewController from '../../meta/Meta.svc'
import OnboardingSkillViewController from '../../onboarding/Onboarding.svc'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import StorySkillViewController from '../../story/Story.svc'

import '@sprucelabs/heartwood-view-controllers'

const vcs = {
    GenerateSkillViewController,
    MembersSkillViewController,
    OnboardingSkillViewController,
    MetaSkillViewController,
    RootSkillViewController,
    StorySkillViewController,
    FeedbackCardViewController,
    FamilyMemberFormCardViewController,
}

export const pluginsByName = {}

type LoadOptions<Args extends Record<string, any>[]> =
    Args[0]['args'] extends Record<string, any>
        ? Args[0]['args']
        : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'eightbitstories.generate': GenerateSkillViewController
        'eightbitstories.members': MembersSkillViewController
        'eightbitstories.onboarding': OnboardingSkillViewController
        'eightbitstories.meta': MetaSkillViewController
        'eightbitstories.root': RootSkillViewController
        'eightbitstories.story': StorySkillViewController
    }

    interface SkillViewControllerArgsMap {
        'eightbitstories.generate': LoadOptions<
            Parameters<GenerateSkillViewController['load']>
        >
        'eightbitstories.members': LoadOptions<
            Parameters<MembersSkillViewController['load']>
        >
        'eightbitstories.onboarding': LoadOptions<
            Parameters<OnboardingSkillViewController['load']>
        >
        'eightbitstories.meta': LoadOptions<
            Parameters<MetaSkillViewController['load']>
        >
        'eightbitstories.root': LoadOptions<
            Parameters<RootSkillViewController['load']>
        >
        'eightbitstories.story': LoadOptions<
            Parameters<StorySkillViewController['load']>
        >
    }

    interface ViewControllerMap {
        'eightbitstories.feedback-card': FeedbackCardViewController
        'eightbitstories.family-member-form-card': FamilyMemberFormCardViewController
        'eightbitstories.generate': GenerateSkillViewController
        'eightbitstories.members': MembersSkillViewController
        'eightbitstories.onboarding': OnboardingSkillViewController
        'eightbitstories.meta': MetaSkillViewController
        'eightbitstories.root': RootSkillViewController
        'eightbitstories.story': StorySkillViewController
    }

    interface ViewControllerOptionsMap {
        'eightbitstories.feedback-card': ConstructorParameters<
            typeof FeedbackCardViewController
        >[0]
        'eightbitstories.family-member-form-card': ConstructorParameters<
            typeof FamilyMemberFormCardViewController
        >[0]
    }

    interface ViewControllerPlugins {}
}

//@ts-ignore
if (typeof heartwood === 'function') {
    //@ts-ignore
    heartwood(vcs, pluginsByName)
}

export default vcs