import { SpruceSchemas, eventFaker } from '@sprucelabs/spruce-test-fixtures'
import { generateId } from '@sprucelabs/test-utils'
import { GetMeta, PublicFamilyMember } from '../../eightbitstories.types'

export default class EventFaker {
    public async fakeGetStoryGenerationStatus(
        cb?: (
            targetAndPayload: GetStoryStatusTargetAndPayload
        ) => void | SpruceSchemas.Eightbitstories.v2023_09_05.GetStoryGenerationStatusResponsePayload
    ) {
        await eventFaker.on(
            'eightbitstories.get-story-generation-status::v2023_09_05',
            (targetAndPayload) => {
                return (
                    cb?.(targetAndPayload) ?? {
                        status: 'generating' as const,
                    }
                )
            }
        )
    }
    public async fakeGetMmpSetup(cb?: () => void) {
        await eventFaker.on(
            'eightbitstories.get-mmp-setup::v2023_09_05',
            () => {
                return (
                    cb?.() ?? {
                        appToken: generateId(),
                        environment: 'production',
                    }
                )
            }
        )
    }

    public async fakeSendMessage(
        cb?: (targetAndPayload: SendMessageTargetAndPayload) => void
    ) {
        await eventFaker.on('send-message::v2020_12_25', (targetAndPayload) => {
            cb?.(targetAndPayload)
            return {
                message: {
                    id: generateId(),
                    dateCreated: 0,
                    body: generateId(),
                    classification: 'transactional' as const,
                    source: {},
                    target: {},
                },
            }
        })
    }
    public async fakeSubmitFeedback(
        cb?: (targetAndPayload: SubmitFeedbackTargetAndPayload) => void
    ) {
        await eventFaker.on(
            'eightbitstories.submit-feedback::v2023_09_05',
            (targetAndPayload) => {
                cb?.(targetAndPayload)
                return {
                    success: true,
                }
            }
        )
    }
    public async fakeDidGenerateStory(
        cb?: (targetAndPayload: DidGenerateTargetAndPayload) => void
    ) {
        await eventFaker.on(
            'eightbitstories.did-generate-story::v2023_09_05',
            (targetAndPayload) => {
                cb?.(targetAndPayload)
            }
        )
    }
    public async fakeGetStory(
        cb?: (targetAndPayload: GetStoryTargetAndPayload) => void | string
    ) {
        await eventFaker.on(
            'eightbitstories.get-story::v2023_09_05',
            (targetAndPayload) => {
                return {
                    body: cb?.(targetAndPayload) ?? generateId(),
                }
            }
        )
    }
    public async fakeGenerateStory(
        cb?: (targetAndPayload: GenerateStoryTargetAndPayload) => void
    ) {
        await eventFaker.on(
            'eightbitstories.generate-story::v2023_09_05',
            (targetAndPayload) => {
                cb?.(targetAndPayload)
            }
        )
    }

    public async fakeUpdateFamilyMember(
        cb?: (targetAndPayload: UpdateFamilyMemberTargetAndPayload) => void
    ) {
        await eventFaker.on(
            'eightbitstories.update-family-member::v2023_09_05',
            (targetAndPayload) => {
                cb?.(targetAndPayload)
                return {
                    familyMember: this.generatePublicFamilyMemberValues(),
                }
            }
        )
    }
    public async fakeDeleteFamilyMember(
        cb?: (targetAndPayload: DeleteMemberTargetAndPayload) => void
    ) {
        await eventFaker.on(
            'eightbitstories.delete-family-member::v2023_09_05',
            (targetAndPayload) => {
                cb?.(targetAndPayload)
                return {
                    success: true,
                }
            }
        )
    }
    public async fakeListFamilyMembers(
        cb?: () =>
            | void
            | PublicFamilyMember[]
            | Promise<void | PublicFamilyMember[]>
    ) {
        await eventFaker.on(
            'eightbitstories.list-family-members::v2023_09_05',
            async () => {
                return {
                    familyMembers: (await cb?.()) ?? [],
                }
            }
        )
    }
    public async fakeAddFamilyMember(
        cb?: (
            targetAndPayload: AddMemberTargetAndPayload
        ) => PublicFamilyMember | void
    ) {
        await eventFaker.on(
            'eightbitstories.add-family-member::v2023_09_05',
            (targetAndPayload) => {
                return {
                    familyMember:
                        cb?.(targetAndPayload) ??
                        this.generatePublicFamilyMemberValues(),
                }
            }
        )
    }
    public generatePublicFamilyMemberValues() {
        return {
            id: generateId(),
            name: generateId(),
            bio: generateId(),
        }
    }

    public async fakeGetMeta(cb?: () => void | GetMeta) {
        await eventFaker.on('eightbitstories.get-meta::v2023_09_05', () => {
            return {
                meta: cb?.() ?? this.generateRandomMeta(),
            }
        })
    }

    public generateRandomMeta(): GetMeta {
        return {
            name: generateId(),
            values: generateId(),
        }
    }

    public generateRandomMetaWithTarget(personId: string) {
        return {
            ...this.generateRandomMeta(),
            target: {
                personId,
            },
        }
    }

    public async fakeSaveMeta(
        cb?: (
            targetAndPayload: SpruceSchemas.Eightbitstories.v2023_09_05.SaveMetaEmitTargetAndPayload
        ) => void
    ) {
        await eventFaker.on(
            'eightbitstories.save-meta::v2023_09_05',
            (targetAndPayload) => {
                cb?.(targetAndPayload)
                return {
                    meta: this.generateRandomMeta(),
                }
            }
        )
    }
}

export type AddMemberTargetAndPayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.AddFamilyMemberEmitTargetAndPayload

export type DeleteMemberTargetAndPayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.DeleteFamilyMemberEmitTargetAndPayload

export type UpdateFamilyMemberTargetAndPayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.UpdateFamilyMemberEmitTargetAndPayload

export type GenerateStoryTargetAndPayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.GenerateStoryEmitTargetAndPayload

export type GetStoryTargetAndPayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.GetStoryEmitTargetAndPayload
export type DidGenerateTargetAndPayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.DidGenerateStoryEmitTargetAndPayload

export type SubmitFeedbackTargetAndPayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.SubmitFeedbackEmitTargetAndPayload

export type SendMessageTargetAndPayload =
    SpruceSchemas.Mercury.v2020_12_25.SendMessageEmitTargetAndPayload

export type GetStoryStatusTargetAndPayload =
    SpruceSchemas.Eightbitstories.v2023_09_05.GetStoryGenerationStatusEmitTargetAndPayload
