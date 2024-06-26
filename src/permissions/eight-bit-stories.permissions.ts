import { buildPermissionContract } from '@sprucelabs/mercury-types'

const eightBitStoriesPermissions = buildPermissionContract({
    id: 'eight-bit-stories',
    name: 'Eight bit stories',
    description: '',
    requireAllPermissions: false,
    permissions: [
        {
            id: 'can-load-family-meta',
            name: 'Can load family meta for themselves.',
            defaults: {
                loggedIn: {
                    default: true,
                },
            },
            requireAllStatuses: false,
        },
        {
            id: 'can-save-family-meta',
            name: 'Can save family meta for themselves.',
            defaults: {
                loggedIn: {
                    default: true,
                },
            },
            requireAllStatuses: false,
        },
        {
            id: 'can-manage-family-members',
            name: 'Can manage family members',
            defaults: {
                loggedIn: {
                    default: true,
                },
            },
            requireAllStatuses: false,
        },
        {
            id: 'can-generate-story',
            name: 'Can generate story',
            defaults: {
                loggedIn: {
                    default: true,
                },
            },
            requireAllStatuses: false,
        },
        {
            id: 'can-read-story',
            name: 'Can read story',
            defaults: {
                loggedIn: {
                    default: true,
                },
            },
            requireAllStatuses: false,
        },
        {
            id: 'can-submit-feedback',
            name: 'Can submit feedback',
            defaults: {
                loggedIn: {
                    default: true,
                },
            },
            requireAllStatuses: false,
        },
        {
            id: 'can-mmp',
            name: 'Can do MMP things (for tracking)',
            defaults: {
                anonymous: {
                    default: true,
                },
                loggedIn: {
                    default: true,
                },
            },
            requireAllStatuses: false,
        },
    ],
})

export default eightBitStoriesPermissions
