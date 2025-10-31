import '@sprucelabs/mercury-types'

declare module '@sprucelabs/mercury-types/build/types/mercury.types' {
	interface PermissionContractMap {
		'eightbitstories.eight-bit-stories': [
			'can-generate-story','can-load-family-meta','can-manage-family-members','can-mmp','can-read-story','can-save-family-meta','can-submit-feedback',
		]
		'heartwood.skill-views': [
			'can-generate-url','can-get-active-theme','can-get-dashboard-cards','can-get-skill-views','can-get-skill-views','can-list-skill-views','can-listen-to-did-register-skill-views','can-manage-organization-themes','can-register-skill-views',
		]
	}
}


export interface PermissionContractMap {}