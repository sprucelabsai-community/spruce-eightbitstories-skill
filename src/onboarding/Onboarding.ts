export default class Onboarding {
	private _didSkipOnboarding = false
	private _isOnboarding = false
	private _name: string | undefined
	private _values: string | undefined

	private static instance?: Onboarding

	public static getInstance() {
		if (!this.instance) {
			this.instance = new this()
		}
		return this.instance
	}

	public static clear() {
		delete this.instance
	}

	public set(options: { name: string; values: string }) {
		const { name, values } = options
		this._name = name
		this._values = values
		this._isOnboarding = true
	}

	public skip() {
		this._didSkipOnboarding = true
	}

	public get name() {
		return this._name
	}

	public get values() {
		return this._values
	}

	public get isOnboarding() {
		return this._isOnboarding
	}

	public get didSkipOnboarding() {
		return this._didSkipOnboarding
	}

	public reset() {
		Onboarding.clear()
	}
}
