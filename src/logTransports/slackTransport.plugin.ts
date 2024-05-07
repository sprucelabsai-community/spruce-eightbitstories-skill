import os from 'os'
import { SchemaError } from '@sprucelabs/schema'
import { Level, LogTransport } from '@sprucelabs/spruce-skill-utils'
import axios from 'axios'

export const buildSlackTransport: (url: string, level: Level) => LogTransport =
    function (url: string, level: Level) {
        if (!url) {
            throw new SchemaError({
                code: 'MISSING_PARAMETERS',
                parameters: ['url'],
            })
        }

        if (!level) {
            throw new SchemaError({
                code: 'MISSING_PARAMETERS',
                parameters: ['level'],
            })
        }

        return async (...messageParts: []) => {
            const message =
                `${os.hostname()} ${level} :: ` + messageParts.join(' ')

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
    }
