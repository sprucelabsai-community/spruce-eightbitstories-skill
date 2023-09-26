import MembersSkillViewController from '../../members/Members.svc'
import MetaSkillViewController from '../../meta/Meta.svc'
import GenerateSkillViewController from '../../skillViewControllers/Generate.svc'
import FormGettingVc from '../../skillViewControllers/Generate.svc'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import StorySkillViewController from '../../skillViewControllers/Story.svc'
import FamilyMemberFormCardViewController from '../../members/FamilyMemberFormCard.vc'

const vcs = {
    MembersSkillViewController,
    MetaSkillViewController,
    GenerateSkillViewController,
    FormGettingVc,
    RootSkillViewController,
    StorySkillViewController,
    FamilyMemberFormCardViewController,
}

type LoadOptions<Args extends Record<string,any>[]> = Args[0]['args'] extends Record<string, any> ? Args[0]['args'] : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
	interface SkillViewControllerMap {
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.': FormGettingVc
		'eightbitstories.root': RootSkillViewController
		'eightbitstories.story': StorySkillViewController
	}

	interface SkillViewControllerArgsMap {
		'eightbitstories.members': LoadOptions<Parameters<MembersSkillViewController['load']>>
		'eightbitstories.meta': LoadOptions<Parameters<MetaSkillViewController['load']>>
		'eightbitstories.generate': LoadOptions<Parameters<GenerateSkillViewController['load']>>
		'eightbitstories.': LoadOptions<Parameters<FormGettingVc['load']>>
		'eightbitstories.root': LoadOptions<Parameters<RootSkillViewController['load']>>
		'eightbitstories.story': LoadOptions<Parameters<StorySkillViewController['load']>>
	}

	interface ViewControllerMap {
		'eightbitstories.family-member-form-card': FamilyMemberFormCardViewController
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.': FormGettingVc
		'eightbitstories.root': RootSkillViewController
		'eightbitstories.story': StorySkillViewController
	}

    interface ViewControllerOptionsMap {
		'eightbitstories.family-member-form-card': ConstructorParameters<typeof FamilyMemberFormCardViewController>[0]
	}
}


//@ts-ignore
if(typeof heartwood === 'function') { heartwood(vcs) }

export default vcs