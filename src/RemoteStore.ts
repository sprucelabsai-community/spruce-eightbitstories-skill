import { MercuryClient } from '@sprucelabs/mercury-client'

export default class RemoteStoreImpl {
	public static Class?: new (
		connectToApi: () => Promise<MercuryClient>
	) => RemoteStore
	private connectToApi: () => Promise<MercuryClient>

	private constructor(connectToApi: () => Promise<MercuryClient>) {
		this.connectToApi = connectToApi
	}

	public static Store(connectToApi: () => Promise<MercuryClient>) {
		return new (this.Class ?? this)(connectToApi)
	}

	public async saveMeta(options: SaveMetaOptions) {
		const { name, values } = options
		const client = await this.connectToApi()
		await client.emitAndFlattenResponses(
			'eightbitstories.save-meta::v2023_09_05',
			{
				payload: {
					meta: {
						name,
						values,
					},
				},
			}
		)
	}
}

export interface SaveMetaOptions {
	name: string
	values: string
}

export interface RemoteStore {
	saveMeta(options: SaveMetaOptions): Promise<void>
}
