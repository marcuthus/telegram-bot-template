import path from "node:path"
import fs from "node:fs"

import { ArgusError } from "@marcuth/argus"
import { z } from "zod"

import { AnyCommand, ExtendedContext } from "../interfaces/command/index"
import { createScopedLogger } from "../../helpers/logger.helper"
import { escapeHtml } from "../utils/message/escape-html"
import { argus } from "../../helpers/argus.helper"
import { Client } from "../index"

const logger = createScopedLogger("client")

export default async (client: Client) => {
    const commandsDirPath = path.join(__dirname, "../commands")
    const fileExtension = path.extname(__filename)

    const commandDirs = fs
        .readdirSync(commandsDirPath)
        .filter((dir) => fs.lstatSync(path.join(commandsDirPath, dir)).isDirectory())

    for (const dir of commandDirs) {
        const subFolder = path.join(commandsDirPath, dir)
        const commandFiles = fs.readdirSync(subFolder).filter((file) => file.endsWith(fileExtension))

        for (const file of commandFiles) {
            const commandFilePath = path.join(subFolder, file)
            const command = await importCommand(commandFilePath)

            if (!command.name) {
                logger.error(`Not valid command name on: ${commandFilePath}`)
                throw new Error(`Not valid command name on: ${commandFilePath}`)
            }

            if (!command.run) {
                logger.error(`Not valid command run on: ${commandFilePath}`)
                throw new Error(`Not valid command run on: ${commandFilePath}`)
            }

            if (!/^[a-z0-9_]{1,32}$/.test(command.name)) {
                const message = `Invalid command name '${command.name}' on: ${commandFilePath}. Telegram only allows 1-32 lowercase letters, digits and underscores.`
                logger.error(message)
                throw new Error(message)
            }

            if (!command.description || command.description.length < 3 || command.description.length > 256) {
                const message = `Invalid command description on: ${commandFilePath}. Telegram requires 3-256 characters.`
                logger.error(message)
                throw new Error(message)
            }

            client.commands.set(command.name, command)
            client.command(command.name, (context) => runCommand(command, context.message.text, context))

            logger.info(`The command '${command.name}' loaded.`)
        }
    }

    async function runCommand(command: AnyCommand, messageContent: string, context: ExtendedContext) {
        let options: Record<string, unknown> = {}

        try {
            const props = argus.extractCommandProps(messageContent)

            options = argus.validateCommandWithArguments({
                name: command.name,
                arguments: props.arguments,
                schema: command.schema ?? z.object({})
            }).options
        } catch (error) {
            if (error instanceof ArgusError) {
                await context.replyWithHTML(`<code>Erro de argumentos:</code>\n\n${escapeHtml(error.message)}`)
                return
            }

            if (error instanceof z.ZodError) {
                const issues = error.issues
                    .map(
                        (issue) =>
                            `<code>- ${escapeHtml(issue.path.join("."))}</code> | <i>${escapeHtml(issue.message)}</i>`
                    )
                    .join("\n")

                await context.replyWithHTML(`<code>Erro de argumentos:</code>\n\n${issues}`)
                return
            }

            throw error
        }

        try {
            logger.info(`Running the command '${command.name}'.`)
            await command.run(context, options)
        } catch (error) {
            logger.error(error)

            await context.reply(`Ocorreu um erro ao tentar executar o comando \`${command.name}\`!`)
        }
    }

    async function importCommand(commandFilePath: string) {
        const command: AnyCommand = (await import(commandFilePath)).command
        return command
    }
}
