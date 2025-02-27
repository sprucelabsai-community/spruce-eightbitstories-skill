import {
    buttonAssert,
    interactor,
    listAssert,
    navigationAssert,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { eventFaker, fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, assert, generateId } from '@sprucelabs/test-utils'
import FamilyMemberFormCardViewController from '../../../members/FamilyMemberFormCard.vc'
import MembersSkillViewController from '../../../members/Members.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import { DeleteMemberTargetAndPayload } from '../../support/EventFaker'
import SpyFamilyMemberCard from './SpyFamilyMemberCard'

@fake.login()
@suite()
export default class ManageFamilyMembersSkillViewTest extends AbstractEightBitTest {
    private vc!: SpyMembersSkillView

    protected async beforeEach() {
        await super.beforeEach()
        this.views.setController('eightbitstories.members', SpyMembersSkillView)
        this.views.setController(
            'eightbitstories.family-member-form-card',
            SpyFamilyMemberCard
        )
        this.vc = this.views.Controller(
            'eightbitstories.members',
            {}
        ) as SpyMembersSkillView

        await this.eventFaker.fakeListFamilyMembers(() => this.members.find({}))
        await this.eventFaker.fakeDeleteFamilyMember()
        await this.eventFaker.fakeUpdateFamilyMember()
    }

    @test()
    protected viewRendersCard() {
        vcAssert.assertSkillViewRendersCard(this.vc)
    }

    @test()
    protected async cardRendersList() {
        listAssert.cardRendersList(this.cardVc)
    }

    @test()
    protected async listRendersNoResultsRowToStart() {
        await this.load()
        listAssert.listRendersRow(this.listVc, 'no-results')
    }

    @test()
    protected async cardRendersAddAndBackButtons() {
        buttonAssert.cardRendersButtons(this.cardVc, ['add', 'back'])
    }

    @test()
    protected async clickingBackRedirectsToRoot() {
        await this.load()

        await vcAssert.assertActionRedirects({
            action: () => this.clickButton('back'),
            router: this.views.getRouter(),
            destination: {
                id: 'eightbitstories.root',
            },
        })
    }

    @test()
    protected async clickingAddMemberRendersDialog() {
        const { familyVc, dialogVc } =
            await this.clickAddAndAssertRendersFormCard()
        await interactor.cancelForm(familyVc.getFormVc())
        assert.isFalse(dialogVc.getIsVisible())
    }

    @test()
    protected async addingMemberHidesDialog() {
        await this.load()
        await this.eventFaker.fakeAddFamilyMember()
        const { familyVc, dialogVc } =
            await this.clickAddAndAssertRendersFormCard()
        await familyVc.fillOutRandomly()
        await interactor.submitForm(familyVc.getFormVc())
        assert.isFalse(dialogVc.getIsVisible())
    }

    @test()
    @seed('familyMembers', 1)
    protected async loadsFirstFamilyMember() {
        const match = await this.getFirstFamilyMember({
            shouldIncludePrivateFields: false,
        })
        await this.load()

        listAssert.listRendersRow(this.listVc, match.id)
    }

    @test()
    protected async addingAFamilyMemberRefreshesTheList() {
        await this.load()

        let hitCount = 0

        await this.eventFaker.fakeListFamilyMembers(() => {
            hitCount++
        })

        const { familyVc } = await this.clickAddAndAssertRendersFormCard()
        await familyVc.simulateAddMember({
            id: generateId(),
            name: generateId(),
            bio: generateId(),
        })

        assert.isEqual(hitCount, 1)
    }

    @test()
    @seed('familyMembers', 1)
    protected async eachMemberRowRendersDeleteButton() {
        const match = await this.loadAndGetFirstMember()
        listAssert.rowRendersButton(this.listVc, match.id, 'delete')
    }

    @test()
    @seed('familyMembers', 1)
    protected async clickingDeleteButtonRendersConfirmation() {
        await this.loadClickDeleteAndAssertConfirm()
    }

    @test()
    @seed('familyMembers', 1)
    protected async clickingDeleteEmitsDeleteEvent() {
        let passedTarget: DeleteMemberTargetAndPayload['target'] | undefined

        await this.eventFaker.fakeDeleteFamilyMember(({ target }) => {
            passedTarget = target
        })

        await this.loadClickDeleteAndConfirm()

        const match = await this.getFirstFamilyMember()

        assert.isEqualDeep(passedTarget, {
            familyMemberId: match.id,
        })
    }

    @test()
    @seed('familyMembers', 1)
    protected async decliningDoesNotDelete() {
        let wasHit = false

        await this.eventFaker.fakeDeleteFamilyMember(() => {
            wasHit = true
        })

        const confirmVc = await this.loadClickDeleteAndAssertConfirm()
        await confirmVc.decline()

        assert.isFalse(wasHit)
    }

    @test()
    @seed('familyMembers', 1)
    protected async failingToDeleteRendersAlert() {
        await eventFaker.makeEventThrow(
            'eightbitstories.delete-family-member::v2023_09_05'
        )

        await vcAssert.assertRendersAlert(this.vc, () =>
            this.loadClickDeleteAndConfirm()
        )
    }

    @test()
    @seed('familyMembers', 3)
    protected async deletingMemberRemovesRow() {
        const members = await this.members.find({})

        await this.load()

        await this.clickDeleteConfirmAndAssertRemovedRow(members[0].id)
        listAssert.listRendersRow(this.listVc, members[1].id)

        await this.clickDeleteConfirmAndAssertRemovedRow(members[2].id)
    }

    @test()
    @seed('familyMembers', 1)
    protected async clickingFamilyMemberRendersDialog() {
        const { cardVc, formVc, match } =
            await this.loadClickFirstMemberAssertDialog()

        assert.isEqual(cardVc.getFamilyMemberId(), match.id)

        const values = formVc.getValues()

        assert.isEqual(values.name, match.name)
        assert.isEqual(values.bio, match.bio)
    }

    @test()
    @seed('familyMembers', 1)
    protected async cancellingEditHidesDialog() {
        const { dlgVc, formVc } = await this.loadClickFirstMemberAssertDialog()
        await interactor.cancelForm(formVc)
        assert.isFalse(dlgVc.getIsVisible())
    }

    @test()
    @seed('familyMembers', 1)
    protected async submittingEditFormHidesDialog() {
        const { dlgVc, formVc } = await this.loadClickFirstMemberAssertDialog()
        await interactor.submitForm(formVc)
        assert.isFalse(dlgVc.getIsVisible())
    }

    @test()
    @seed('familyMembers', 1)
    protected async updatingMemberUpdatesRow() {
        const { formVc } = await this.loadClickFirstMemberAssertDialog()
        const newName = generateId()
        const newBio = generateId()

        await formVc.setValues({ name: newName, bio: newBio })

        await interactor.submitForm(formVc)

        listAssert.rowRendersContent(this.listVc, 0, newName)
        listAssert.rowRendersContent(this.listVc, 0, newBio)
    }

    @test()
    protected async doesNotRenderNavigation() {
        navigationAssert.skillViewDoesNotRenderNavigation(this.vc)
    }

    private async loadClickFirstMemberAssertDialog() {
        const match = await this.loadAndGetFirstMember()
        const { cardVc, formVc, dlgVc } = await this.clickAndRowAssertDialog(
            match.id
        )
        return { cardVc, formVc, dlgVc, match }
    }

    private async clickAndRowAssertDialog(id: string) {
        const dlgVc = await vcAssert.assertRendersDialog(this.vc, () =>
            interactor.clickRow(this.listVc, id)
        )

        const cardVc = vcAssert.assertRendersAsInstanceOf(
            dlgVc,
            FamilyMemberFormCardViewController
        ) as SpyFamilyMemberCard

        const formVc = cardVc.getFormVc()
        return { cardVc, formVc, dlgVc }
    }

    private async clickDeleteConfirmAndAssertRemovedRow(id: string) {
        await this.clickDeleteAndConfirm(id)
        this.assertDoesNotRenderRow(id)
    }

    private async clickDeleteAndConfirm(id: string) {
        const confirmVc = await this.clickDeleteAndAssertConfirm(id)
        await confirmVc.accept()
    }

    private assertDoesNotRenderRow(id: string) {
        listAssert.listDoesNotRenderRow(this.listVc, id)
    }

    private async loadClickDeleteAndConfirm() {
        const confirmVc = await this.loadClickDeleteAndAssertConfirm()
        await confirmVc.accept()
    }

    private async loadClickDeleteAndAssertConfirm() {
        await this.load()
        return await this.clickDeleteAndAssertConfirm()
    }

    private async clickDeleteAndAssertConfirm(rowIdOrIdx: number | string = 0) {
        return await vcAssert.assertRendersConfirm(this.vc, () =>
            interactor.clickButtonInRow(this.listVc, rowIdOrIdx, 'delete')
        )
    }

    private async loadAndGetFirstMember() {
        await this.load()
        const match = await this.getFirstFamilyMember()
        return match
    }

    private get listVc() {
        return this.vc.getListVc()
    }

    private async load() {
        await this.views.load(this.vc)
    }

    private async clickAddAndAssertRendersFormCard() {
        const dialogVc = await vcAssert.assertRendersDialog(this.vc, () =>
            this.clickButton('add')
        )
        const familyVc = vcAssert.assertRendersAsInstanceOf(
            dialogVc,
            FamilyMemberFormCardViewController
        )
        return { familyVc: familyVc as SpyFamilyMemberCard, dialogVc }
    }

    private clickButton(button: string): any {
        return interactor.clickButton(this.cardVc, button)
    }

    private get cardVc() {
        return this.vc.getCardVc()
    }
}

class SpyMembersSkillView extends MembersSkillViewController {
    public getListVc() {
        return this.activeRecordCardVc.getListVc()
    }
    public getCardVc() {
        return this.cardVc
    }
}
