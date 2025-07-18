import {
    AbstractViewController,
    ViewControllerOptions,
    Card,
    CardViewController,
    buildForm,
    FormViewController,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions, buildSchema } from '@sprucelabs/schema'

export default class FeedbackCardViewController extends AbstractViewController<Card> {
    public static id = 'feedback-card'
    private cardVc: CardViewController
    protected formVc: FormViewController<FeedbackSchema>
    protected onSubmitHandler: () => void

    public constructor(options: ViewControllerOptions & FeedbackCardOptions) {
        super(options)

        const { onSubmit } = assertOptions(options, ['onSubmit'])

        this.onSubmitHandler = onSubmit

        this.formVc = this.FormVc()
        this.cardVc = this.CardVc()
    }

    private CardVc(): CardViewController {
        return this.Controller('card', {
            header: {
                title: 'Submit feedback',
            },
            body: {
                sections: [
                    {
                        text: {
                            content:
                                "Hey there! I'm Tay! I'm the father of 2 daughters and just really struggled with the quality of the books available for my girls. So, what started as a fun experiment eventually turned into 8-bit Stories. 👇",
                        },
                    },
                    {
                        shouldBePadded: false,
                        text: {
                            html: `<iframe width="100%" height="300" src="https://www.youtube.com/embed/MQAs8SOGoxE?si=ZiecE6sSFNX_IURw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
                        },
                    },
                    {
                        text: {
                            content: `Anyway, as an early adopter, you have access to message me directly with your ideas and feedback! I'm gonna try and get back to each request, but this is all new, so I can't say exactly how long it'll take me to do it!`,
                        },
                    },
                    {
                        form: this.formVc.render(),
                    },
                ],
            },
        })
    }

    private FormVc(): FormViewController<FeedbackSchema> {
        return this.Controller(
            'form',
            buildForm({
                schema: feedbackSchema,
                shouldRenderCancelButton: false,
                submitButtonLabel: 'Send Now!',
                onSubmit: this.handleSubmit.bind(this),
                sections: [
                    {
                        fields: [
                            {
                                name: 'feedback',
                                renderAs: 'textarea',
                            },
                        ],
                    },
                ],
            })
        )
    }

    private async handleSubmit() {
        try {
            const client = await this.connectToApi()
            await client.emitAndFlattenResponses(
                'eightbitstories.submit-feedback::v2023_09_05',
                {
                    payload: {
                        feedback: this.formVc.getValue('feedback') as string,
                    },
                }
            )
            this.onSubmitHandler()
        } catch (err: any) {
            this.log.error('Failed to submit feedback', err)
            await this.alert({
                message: 'Oh shoot, something went wrong! Please try again!',
            })
        }
    }

    public render() {
        return this.cardVc.render()
    }
}

interface FeedbackCardOptions {
    onSubmit: () => void
}

const feedbackSchema = buildSchema({
    id: 'feedback',
    fields: {
        feedback: {
            type: 'text',
            label: 'Enter your feedback, ideas, questions, or you know, whatever!',
            isRequired: true,
        },
    },
})

type FeedbackSchema = typeof feedbackSchema
