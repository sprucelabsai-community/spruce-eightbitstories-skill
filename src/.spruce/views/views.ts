import GenerateSkillViewController from '../../generation/Generate.svc'
import FormGettingVc from '../../generation/Generate.svc'
import MembersSkillViewController from '../../members/Members.svc'
import MetaSkillViewController from '../../meta/Meta.svc'
import StorySkillViewController from '../../story/Story.svc'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import FamilyMemberFormCardViewController from '../../members/FamilyMemberFormCard.vc'

const vcs = {
    GenerateSkillViewController,
    FormGettingVc,
    MembersSkillViewController,
    MetaSkillViewController,
    StorySkillViewController,
    RootSkillViewController,
    FamilyMemberFormCardViewController,
}

type LoadOptions<Args extends Record<string,any>[]> = Args[0]['args'] extends Record<string, any> ? Args[0]['args'] : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
	interface SkillViewControllerMap {
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.': FormGettingVc
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.story': StorySkillViewController
		'eightbitstories.root': RootSkillViewController
	}

	interface SkillViewControllerArgsMap {
		'eightbitstories.generate': LoadOptions<Parameters<GenerateSkillViewController['load']>>
		'eightbitstories.': LoadOptions<Parameters<FormGettingVc['load']>>
		'eightbitstories.members': LoadOptions<Parameters<MembersSkillViewController['load']>>
		'eightbitstories.meta': LoadOptions<Parameters<MetaSkillViewController['load']>>
		'eightbitstories.story': LoadOptions<Parameters<StorySkillViewController['load']>>
		'eightbitstories.root': LoadOptions<Parameters<RootSkillViewController['load']>>
	}

	interface ViewControllerMap {
		'eightbitstories.family-member-form-card': FamilyMemberFormCardViewController
		'eightbitstories.generate': GenerateSkillViewController
		'eightbitstories.': FormGettingVc
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.story': StorySkillViewController
		'eightbitstories.root': RootSkillViewController
	}

    interface ViewControllerOptionsMap {
		'eightbitstories.family-member-form-card': ConstructorParameters<typeof FamilyMemberFormCardViewController>[0]
	}
}


//@ts-ignore
if(typeof heartwood === 'function') { heartwood(vcs) }

export default vcs