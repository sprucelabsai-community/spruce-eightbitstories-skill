import AbstractSpruceError from '@sprucelabs/error'
import ErrorOptions from '#spruce/errors/options.types'

export default class SpruceError extends AbstractSpruceError<ErrorOptions> {
	public friendlyMessage(): string {
		const { options } = this
		let message

		switch (options?.code) {
			case 'NOT_FOUND':
				message = `I couldn't find what you were looking for!`
				break

			case 'UNAUTHORIZED_ACCESS':
				message = `Oh no!! I wanted to help, but you can't ${options.youDontHaveAccessTo}`
				break

			default:
				message = super.friendlyMessage()
		}

		const fullMessage = options.friendlyMessage
			? options.friendlyMessage
			: message

		return fullMessage
	}
}
