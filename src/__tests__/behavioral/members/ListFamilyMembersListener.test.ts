import { MercuryClient } from '@sprucelabs/mercury-client'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { assert, test, suite } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
@suite()
export default class ListFamilyMembersListenerTest extends AbstractEightBitTest {
    protected async beforeEach() {
        await super.beforeEach()
        await this.bootSkill()
    }

    @test()
    protected async isListening() {
        await this.emitListFamilyMembers()
    }

    @test()
    @seed('familyMembers', 1)
    protected async returnsFirstFamilyMember() {
        await this.assertTotalMembersReturned(1)
    }

    @test()
    @seed('familyMembers', 1)
    protected async returnsFamilyMembersForLoggedInPerson() {
        const { client } = await this.people.loginAsDemoPerson('555-555-1111')
        await this.assertTotalMembersReturned(0, client)
    }

    private async assertTotalMembersReturned(
        expected: number,
        client?: MercuryClient
    ) {
        const results = await this.emitListFamilyMembers(client)
        assert.isLength(results, expected)
    }

    private async emitListFamilyMembers(client?: MercuryClient) {
        const [{ familyMembers }] = await (
            client ?? this.fakedClient
        ).emitAndFlattenResponses(
            'eightbitstories.list-family-members::v2023_09_05'
        )

        return familyMembers
    }
}
