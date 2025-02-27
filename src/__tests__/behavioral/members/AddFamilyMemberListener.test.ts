import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, suite, generateId, assert } from '@sprucelabs/test-utils'
import { AddFamilyMember } from '../../../eightbitstories.types'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
@suite()
export default class AddFamilyMemberListenerTest extends AbstractEightBitTest {
    private member!: AddFamilyMember

    protected async beforeEach(): Promise<void> {
        await super.beforeEach()

        this.member = {
            name: generateId(),
            bio: generateId(),
        }
        await this.bootSkill()
    }

    @test()
    protected async skillIsListening() {
        await this.emitAddFamilyMember()
    }

    @test()
    protected async emittingAddFamilyMemberCreatesMemberRecord() {
        await this.emitAddFamilyMember()
        const count = await this.members.count()
        assert.isEqual(count, 1)
    }

    @test()
    protected async savesFamilyMemberValues() {
        await this.emitAddFamilyMember()
        const match = await this.getFirstFamilyMember({
            shouldIncludePrivateFields: true,
        })

        assert.doesInclude(match, this.member)
        assert.isEqualDeep(match?.target, {
            personId: this.fakedPerson.id,
        })
    }

    @test()
    protected async returnsFirstFamilyMember() {
        const familyMember = await this.emitAddFamilyMember()
        const match = await this.getFirstFamilyMember()
        assert.doesInclude(match, familyMember)
    }

    private async emitAddFamilyMember() {
        const [{ familyMember }] =
            await this.fakedClient.emitAndFlattenResponses(
                'eightbitstories.add-family-member::v2023_09_05',
                {
                    payload: {
                        familyMember: this.member,
                    },
                }
            )

        return familyMember
    }
}
