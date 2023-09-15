import { EventFeatureListener } from '@sprucelabs/spruce-event-utils'

const listeners: EventFeatureListener[] = [
	{
		eventName: 'add-family-member',
		eventNamespace: 'eightbitstories',
		version: 'v2023_09_05',
		callback:
			require('../../listeners/eightbitstories/add-family-member.v2023_09_05.listener')
				.default,
		isGlobal:
			require('../../listeners/eightbitstories/add-family-member.v2023_09_05.listener')
				.isGlobal,
	},
	{
		eventName: 'list-family-members',
		eventNamespace: 'eightbitstories',
		version: 'v2023_09_05',
		callback:
			require('../../listeners/eightbitstories/list-family-members.v2023_09_05.listener')
				.default,
		isGlobal:
			require('../../listeners/eightbitstories/list-family-members.v2023_09_05.listener')
				.isGlobal,
	},
	{
		eventName: 'did-boot',
		eventNamespace: 'skill',
		version: 'v2023_09_05',
		callback: require('../../listeners/skill/did-boot.v2023_09_05.listener')
			.default,
		isGlobal: require('../../listeners/skill/did-boot.v2023_09_05.listener')
			.isGlobal,
	},
	{
		eventName: 'get-meta',
		eventNamespace: 'eightbitstories',
		version: 'v2023_09_05',
		callback:
			require('../../meta/listeners/eightbitstories/get-meta.v2023_09_05.listener')
				.default,
		isGlobal:
			require('../../meta/listeners/eightbitstories/get-meta.v2023_09_05.listener')
				.isGlobal,
	},
	{
		eventName: 'save-meta',
		eventNamespace: 'eightbitstories',
		version: 'v2023_09_05',
		callback:
			require('../../meta/listeners/eightbitstories/save-meta.v2023_09_05.listener')
				.default,
		isGlobal:
			require('../../meta/listeners/eightbitstories/save-meta.v2023_09_05.listener')
				.isGlobal,
	},
]

export default listeners
