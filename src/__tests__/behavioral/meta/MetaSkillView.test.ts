import {
    SkillViewControllerId,
    SpruceSchemas,
    buttonAssert,
    formAssert,
    interactor,
    navigationAssert,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { TestRouter, eventFaker, fake } from '@sprucelabs/spruce-test-fixtures'
import { assert, generateId, test, suite } from '@sprucelabs/test-utils'
import { GetMeta } from '../../../eightbitstories.types'
import MetaSkillViewController from '../../../meta/Meta.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
@suite()
export default class MetaSkillViewTest extends AbstractEightBitTest {
    private vc!: SpyMetaSkillView
    private passedMeta?: SpruceSchemas.Eightbitstories.v2023_09_05.GetMeta
    private meta!: GetMeta

    public async beforeEach() {
        await super.beforeEach()
        this.views.setController('eightbitstories.meta', SpyMetaSkillView)

        this.vc = this.MetaVc()
        this.meta = this.eventFaker.generateRandomMeta()

        await this.eventFaker.fakeGetMeta(() => this.meta)

        await this.loadVc()

        delete this.passedMeta
        await this.eventFaker.fakeSaveMeta(({ payload }) => {
            this.passedMeta = payload.meta
            return {
                meta: this.meta,
            }
        })
    }

    @test()
    protected async requiresBeingLoggedIn() {
        await vcAssert.assertLoginIsRequired(this.vc)
    }

    @test()
    protected async rendersACard() {
        vcAssert.assertSkillViewRendersCard(this.vc)
    }

    @test()
    protected async redirectsOnClickToCancel() {
        await this.assertFormActionRedirectsToRoot('back')
    }

    @test()
    protected async rendersAlertIfSaveFails() {
        await eventFaker.makeEventThrow(
            'eightbitstories.save-meta::v2023_09_05'
        )
        await vcAssert.assertRendersAlert(this.vc, () => this.submitForm())
    }

    @test()
    protected async submittingEmitsSaveMetaEvent() {
        const { name, values } = await this.randomizeMetaAndSetFormValues()

        await this.submitFormAndAssertRedirect()

        assert.isEqualDeep(this.passedMeta, {
            name,
            values,
        })
    }

    @test()
    protected async redirectsOnClickToSave() {
        await this.randomizeMetaAndSetFormValues()
        await this.assertFormActionRedirectsToRoot('save')
    }

    @test()
    protected async rendersForm() {
        formAssert.cardRendersForm(this.cardVc)
    }

    @test()
    protected async rendersExpectedFormFields() {
        formAssert.formRendersFields(this.formVc, ['name', 'values'])
    }

    @test()
    protected async loadingViewLoadsMeta() {
        const values = this.formVc.getValues()
        assert.isEqualDeep(values, this.meta)
    }

    @test()
    protected async doesNotRenderNavigation() {
        navigationAssert.skillViewDoesNotRenderNavigation(this.vc)
    }

    @test()
    protected async rendersFacebookGroupButton() {
        buttonAssert.cardRendersButton(this.cardVc, 'facebookGroup')
    }

    @test()
    protected async clickingFacebookGroupButtonOpensUrl() {
        TestRouter.setShouldThrowWhenRedirectingToBadSvc(false)
        await vcAssert.assertActionRedirects({
            action: () => interactor.clickButton(this.formVc, 'facebookGroup'),
            router: this.views.getRouter(),
            destination: {
                id: 'https://www.facebook.com/groups/8bitstories' as SkillViewControllerId,
            },
        })
    }

    private MetaVc(): SpyMetaSkillView {
        return this.views.Controller(
            'eightbitstories.meta',
            {}
        ) as SpyMetaSkillView
    }

    private async submitFormAndAssertRedirect() {
        await vcAssert.assertActionRedirects({
            action: () => this.submitForm(),
            router: this.views.getRouter(),
        })
    }

    private async randomizeMetaAndSetFormValues() {
        this.meta.name = generateId()
        this.meta.values = generateId()
        await this.fillOutForm({ ...this.meta })
        return this.meta
    }

    private async fillOutForm(meta: GetMeta) {
        await this.formVc.setValues({
            ...meta,
        })
    }

    private async assertFormActionRedirectsToRoot(action: 'back' | 'save') {
        const strategy = {
            back: () => interactor.cancelForm(this.formVc),
            save: () => this.submitForm(),
        }

        await vcAssert.assertActionRedirects({
            action: () => strategy[action](),
            router: this.views.getRouter(),
            destination: {
                id: 'eightbitstories.root',
            },
        })
    }

    private submitForm() {
        return interactor.submitForm(this.formVc)
    }

    private async loadVc() {
        await this.views.load(this.vc)
    }

    private get cardVc() {
        return this.vc.getCardVc()
    }

    private get formVc() {
        return this.vc.getFormVc()
    }
}

class SpyMetaSkillView extends MetaSkillViewController {
    public getFormVc() {
        return this.formVc
    }
    public getCardVc() {
        return this.cardVc
    }
}
