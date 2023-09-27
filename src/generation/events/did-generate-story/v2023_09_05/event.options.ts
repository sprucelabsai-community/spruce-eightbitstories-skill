import {
	EventSignature,
	buildPermissionReference,
} from '@sprucelabs/mercury-types'
import '#spruce/permissions/permissions.types'
import '@sprucelabs/mercury-core-events'

type Options = Omit<
	EventSignature,
	| 'responsePayloadSchema'
	| 'emitPayloadSchema'
	| 'listenPermissionContract'
	| 'emitPermissionContract'
>

const eventOptions: Options = {
	isGlobal: true,
	listenPermissions: buildPermissionReference(
		'eightbitstories.eight-bit-stories',
		['can-generate-story']
	),
}

export default eventOptions
