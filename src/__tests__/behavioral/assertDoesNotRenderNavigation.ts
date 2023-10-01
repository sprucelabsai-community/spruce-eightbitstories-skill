import { assert } from '@sprucelabs/test-utils'

export function assertDoesNotRenderNavigation(vc: {
	renderNavigation: () => null
}) {
	assert.isNull(vc.renderNavigation())
}
