import os from 'os'
import { Level, LogTransport } from '@sprucelabs/spruce-skill-utils'
import axios from 'axios'

export default function (): {
    levels: Level[]
    transport: LogTransport
} | null {
    return {
        levels: ['ERROR'],
        transport: async (...messageParts: string[]) => {
            const url = process.env.SLACK_ERROR_LOG_WEBHOOK_URL

            if (url) {
                const message = `${os.hostname()} :: ` + messageParts.join(' ')

                try {
                    await axios({
                        url,
                        method: 'POST',
                        data: { text: message },
                        timeout: 1000,
                    })
                } catch (err: any) {
                    console.error(
                        `Slack transport error reaching ${url}:\n\n` +
                            err.stack +
                            `\n\nOriginal Error: ${message}`
                    )
                }
            }
        },
    }
}
