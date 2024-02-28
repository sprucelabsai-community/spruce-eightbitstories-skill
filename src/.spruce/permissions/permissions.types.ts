import '@sprucelabs/mercury-types'

declare module '@sprucelabs/mercury-types/build/types/mercury.types' {
	interface PermissionContractMap {
		'eightbitstories.eight-bit-stories': [
			'can-load-family-meta','can-save-family-meta','can-manage-family-members','can-generate-story','can-read-story','can-submit-feedback',
		]
	}
}


export interface PermissionContractMap {}