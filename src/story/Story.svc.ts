import {
    CardViewController,
    Router,
    SkillView,
    SkillViewControllerLoadOptions,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { buildRouteToCreateInvite } from '@sprucelabs/spruce-invite-utils'
import AbstractLoggedInEightBitSkillView from '../skillViewControllers/AbstractLoggedInEightBitSkillView'

export default class StorySkillViewController extends AbstractLoggedInEightBitSkillView {
    public static id = 'story'
    protected cardVc: CardViewController
    private router!: Router
    private storyId!: string

    public constructor(options: ViewControllerOptions) {
        super(options)
        this.cardVc = this.CardVc()
    }

    private CardVc(): CardViewController {
        return this.Controller('card', {
            id: 'story',
            header: {
                title: 'Story of the night!',
            },
            body: {},
            footer: {
                buttons: [
                    {
                        id: 'share',
                        label: 'Share',
                        onClick: this.handleClickShare.bind(this),
                    },
                    {
                        id: 'again',
                        label: 'Again',
                        onClick: this.handleClickAgain.bind(this),
                    },
                    {
                        id: 'done',
                        type: 'primary',
                        label: 'Done',
                        onClick: this.handleClickDone.bind(this),
                    },
                ],
            },
        })
    }

    private async handleClickShare() {
        await this.router.redirect(
            //@ts-ignore
            'invite.create',
            buildRouteToCreateInvite({
                destinationAfterAccept: {
                    id: 'eightbitstories.story',
                    args: {
                        story: this.storyId,
                    },
                },
                destinationAfterCreate: {
                    id: 'eightbitstories.story',
                    args: {
                        story: this.storyId,
                    },
                },
                message: 'Check out this amazing story about the fam!',
            })[1]
        )
    }

    private async handleClickAgain() {
        await this.router.redirect('eightbitstories.generate')
    }

    private async handleClickDone() {
        await this.router.redirect('eightbitstories.root')
    }

    public async load(options: SkillViewControllerLoadOptions<Args>) {
        const { router, args } = options
        const { story } = args

        this.router = router
        this.cardVc.setIsBusy(true)
        this.storyId = story

        try {
            await this.loadStory(story)

            this.cardVc.setIsBusy(false)
        } catch (err: any) {
            await this.alert({
                message: err.message ?? 'Could not load that story!',
            })
            await this.router.redirect('eightbitstories.root')
        }
    }

    private async loadStory(story: string) {
        const client = await this.connectToApi()
        const [{ body }] = await client.emitAndFlattenResponses(
            'eightbitstories.get-story::v2023_09_05',
            {
                target: {
                    storyId: story,
                },
            }
        )

        this.cardVc.addSection({
            text: {
                content: body,
            },
        })
    }

    public render(): SkillView {
        return {
            layouts: [
                {
                    cards: [this.cardVc.render()],
                },
            ],
        }
    }
}

interface Args {
    story: string
}
