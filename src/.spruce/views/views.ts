import MetaSkillViewController from '../../meta/Meta.svc'
import MembersSkillViewController from '../../members/Members.svc'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import FamilyMemberFormCardViewController from '../../members/FamilyMemberFormCard.vc'

const vcs = {
    MetaSkillViewController,
    MembersSkillViewController,
    RootSkillViewController,
    FamilyMemberFormCardViewController,
}

type LoadOptions<Args extends Record<string,any>[]> = Args[0]['args'] extends Record<string, any> ? Args[0]['args'] : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
	interface SkillViewControllerMap {
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.root': RootSkillViewController
	}

	interface SkillViewControllerArgsMap {
		'eightbitstories.meta': LoadOptions<Parameters<MetaSkillViewController['load']>>
		'eightbitstories.members': LoadOptions<Parameters<MembersSkillViewController['load']>>
		'eightbitstories.root': LoadOptions<Parameters<RootSkillViewController['load']>>
	}

	interface ViewControllerMap {
		'eightbitstories.family-member-form-card': FamilyMemberFormCardViewController
		'eightbitstories.meta': MetaSkillViewController
		'eightbitstories.members': MembersSkillViewController
		'eightbitstories.root': RootSkillViewController
	}

    interface ViewControllerOptionsMap {
		'eightbitstories.family-member-form-card': ConstructorParameters<typeof FamilyMemberFormCardViewController>[0]
	}
}


//@ts-ignore
if(typeof heartwood === 'function') { heartwood(vcs) }

export default vcs