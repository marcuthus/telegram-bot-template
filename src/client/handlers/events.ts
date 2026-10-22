import path from "node:path"
import fs from "node:fs"

import { Context } from "telegraf"

import { createScopedLogger } from "../../helpers/logger.helper"
import { Event } from "../interfaces/event"
import { Client } from "../index"

const logger = createScopedLogger("client")

export default async (client: Client) => {
    const eventsDirPath = path.join(__dirname, "../events")
    const fileExtension = path.extname(__filename)

    const eventFiles = fs.readdirSync(eventsDirPath).filter((file) => file.endsWith(fileExtension))

    for (const file of eventFiles) {
        const eventFilePath = path.join(eventsDirPath, file)
        const event = await importEvent(eventFilePath)

        switch (event.type) {
            case "on":
                client.on(event.name, (context) => event.run(context as Context))
                break
            case "once": {
                let alreadyRan = false

                client.on(event.name, async (context, next) => {
                    if (alreadyRan) return next()

                    alreadyRan = true
                    await event.run(context as Context)
                })
                break
            }
            default:
                logger.error(`The value '${event.type}' that informed for the type of the event is invalid.`, {
                    eventFilePath: eventFilePath
                })
                throw new Error(`The value '${event.type}' that informed for the type of the event is invalid.`)
        }

        logger.info(`The event '${event.name}' loaded.`, { eventFilePath: eventFilePath })
    }

    async function importEvent(eventFilePath: string) {
        const event: Event = (await import(eventFilePath)).event
        return event
    }
}
