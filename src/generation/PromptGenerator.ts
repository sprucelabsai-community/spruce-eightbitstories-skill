import { assertOptions } from '@sprucelabs/schema'
import { PublicFamilyMember, StoryElement } from '../eightbitstories.types'
import { INTRO } from './constants'

export default class PromptGenerator {
    public static Generator() {
        return new this()
    }

    public generate(options: GeneratePromptOptions) {
        const {
            familyMembers,
            familyValues,
            familyName,
            storyElements,
            currentChallenge,
        } = assertOptions(options, [
            'familyMembers',
            'familyValues',
            'familyName',
            'storyElements',
        ])

        let message = INTRO

        message += `\n\n\nFamily Name:\n${familyName}`
        message += `\n\nFamily Values:\n${familyValues}\n`
        message += `\n\nFamily Members:\n${familyMembers
            .map(
                (member) => 'Name: ' + member.name + '\n' + 'Bio: ' + member.bio
            )
            .join('\n\n')}\n`
        message += `\n\nDesired Story Elements: \n`
        message += storyElements
            .map((element) => element.name + ':' + element.description)
            .join('\n\n')

        if (currentChallenge) {
            message += `\n\nCurrent Challenge To Focus On For This Story:\n${currentChallenge}`
        }

        message += `\n\nDuration:\n10 minutes\n`

        return message
    }
}

export interface GeneratePromptOptions {
    familyMembers: Omit<PublicFamilyMember, 'id'>[]
    familyValues: string
    familyName: string
    storyElements: StoryElement[]
    currentChallenge?: string
}
