import * as telegraf from "telegraf"

import { createScopedLogger } from "./helpers/logger.helper"
import { AnyCommand } from "./interfaces/command/index"
import { configHelper } from "./helpers/config.helper"
import handleCommands from "./handlers/commands"
import handleEvents from "./handlers/events"

const logger = createScopedLogger("client")

export class Client extends telegraf.Telegraf {
    public commands: Map<string, AnyCommand> = new Map()
    public commandCategories: Map<string, string> = new Map()
}

function createClient() {
    const token = configHelper.token

    const client = new Client(token)

    client.use(async (context, next) => {
        context.state.client = client
        await next()
    })

    client.use(async (_context, next) => {
        const start = Date.now()
        await next()
        logger.debug(`Telegram response time: ${Date.now() - start} ms.`)
    })

    client.catch((error, context) => {
        logger.error(`Error on update '${context.updateType}': ${error}`)
    })

    async function useEventsHandler() {
        await handleEvents(client)
    }

    async function useCommandsHandler() {
        await handleCommands(client)
    }

    async function start() {
        logger.info("Starting...")

        await useEventsHandler()
        await useCommandsHandler()

        await client.telegram.setMyCommands(
            Array.from(client.commands.values()).map((command) => ({
                command: command.name,
                description: command.description
            }))
        )

        logger.info("All commands synchronized with Telegram!")

        // launch() only resolves when the bot stops, so the callback signals the startup.
        await client.launch(() => {
            logger.info(`Successfully started as '${client.botInfo?.username}'`)
        })
    }

    function stop(reason?: string) {
        logger.info("Stoping...")

        client.stop(reason)

        logger.info("Successfully stopped!")
    }

    async function restart() {
        stop("restart")
        await start()
    }

    return { start, stop, restart }
}

export default createClient
