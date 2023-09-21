import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface UnauthorizedAccessErrorOptions extends SpruceErrors.Eightbitstories.UnauthorizedAccess, ISpruceErrorOptions {
	code: 'UNAUTHORIZED_ACCESS'
}
export interface NotFoundErrorOptions extends SpruceErrors.Eightbitstories.NotFound, ISpruceErrorOptions {
	code: 'NOT_FOUND'
}

type ErrorOptions =  | UnauthorizedAccessErrorOptions  | NotFoundErrorOptions 

export default ErrorOptions
