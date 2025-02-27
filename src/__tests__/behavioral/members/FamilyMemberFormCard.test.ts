import {
    formAssert,
    interactor,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { eventFaker, fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, assert, generateId } from '@sprucelabs/test-utils'
import {
    AddFamilyMember,
    PublicFamilyMember,
} from '../../../eightbitstories.types'
import { FamilyMemberFormCardOptions } from '../../../members/FamilyMemberFormCard.vc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import {
    AddMemberTargetAndPayload,
    UpdateFamilyMemberTargetAndPayload,
} from '../../support/EventFaker'
import SpyFamilyMemberCard from './SpyFamilyMemberCard'

@fake.login()
@suite()
export default class FamilyMemberFormCardTest extends AbstractEightBitTest {
    private vc!: SpyFamilyMemberCard
    private lastAddedMember?: PublicFamilyMember

    protected async beforeEach() {
        await super.beforeEach()

        delete this.lastAddedMember

        this.views.setController(
            'eightbitstories.family-member-form-card',
            SpyFamilyMemberCard
        )
        this.vc = this.Vc()
    }

    @test()
    protected async cardRendersForm() {
        formAssert.cardRendersForm(this.vc)
    }

    @test()
    protected async formRendersExpectedFields() {
        formAssert.formRendersFields(this.formVc, ['name', 'bio'])
    }

    @test()
    protected async errorSubmittingRendersAlert() {
        await eventFaker.makeEventThrow(
            'eightbitstories.add-family-member::v2023_09_05'
        )

        await vcAssert.assertRendersAlert(this.vc, () =>
            this.submitRandomValues()
        )
    }

    @test()
    protected async passesExpectedPayloadToAddEvent() {
        let passedPayload: AddMemberTargetAndPayload['payload'] | undefined

        await this.eventFaker.fakeAddFamilyMember(({ payload }) => {
            passedPayload = payload
        })

        await this.submitRandomValues()

        assert.isEqualDeep(passedPayload?.familyMember, this.getValues())
    }

    @test()
    protected async onAddHandlerCalledWithMemberFromResponseToAddEvent() {
        const values: PublicFamilyMember = {
            id: generateId(),
            name: generateId(),
            bio: generateId(),
        }

        await this.eventFaker.fakeAddFamilyMember(() => {
            return values
        })

        await this.submitRandomValues()

        assert.isEqualDeep(this.lastAddedMember, values)
    }

    @test()
    @seed('familyMembers', 1)
    protected async submittingWithMemberEmitsUpdateEvent() {
        const member = await this.resetWithFirstMember()

        let passedTarget:
            | UpdateFamilyMemberTargetAndPayload['target']
            | undefined
        let passedPayload:
            | UpdateFamilyMemberTargetAndPayload['payload']
            | undefined

        await this.eventFaker.fakeUpdateFamilyMember(({ target, payload }) => {
            passedTarget = target
            passedPayload = payload
        })

        const values = await this.submitRandomValues()

        assert.isEqualDeep(passedTarget?.familyMemberId, member.id)
        assert.isEqualDeep(passedPayload?.familyMember, values)
    }

    @test()
    @seed('familyMembers', 1)
    protected async errorUpdatingRendersAlert() {
        await this.resetWithFirstMember()
        await eventFaker.makeEventThrow(
            'eightbitstories.update-family-member::v2023_09_05'
        )

        await vcAssert.assertRendersAlert(this.vc, () => this.submitForm())
    }

    private async resetWithFirstMember() {
        const member = await this.getFirstFamilyMember()
        this.vc = this.Vc({
            member,
        })
        return member
    }

    private Vc(
        options?: Partial<FamilyMemberFormCardOptions>
    ): SpyFamilyMemberCard {
        return this.views.Controller(
            'eightbitstories.family-member-form-card',
            {
                onCancel: () => {},
                onAdd: (member: PublicFamilyMember) => {
                    this.lastAddedMember = member
                },
                ...options,
            }
        ) as SpyFamilyMemberCard
    }

    private async submitRandomValues() {
        const values = await this.fillOutFormWithRandomValues()
        await this.submitForm()
        return values
    }

    private submitForm(): any {
        return interactor.submitForm(this.formVc)
    }

    private async fillOutFormWithRandomValues() {
        return await this.vc.fillOutRandomly()
    }

    private get formVc() {
        return this.vc.getFormVc()
    }

    private getValues() {
        return this.formVc.getValues() as AddFamilyMember
    }
}
