import { escapeHtml } from "../../utils/message/escape-html"
import { getClient } from "../../utils/command/get-client"
import { configHelper } from "../../helpers/config.helper"
import { Command } from "../../interfaces/command"
import { Embed } from "../../utils/message/embed"

const categoryLabels: Record<string, string> = {
    info: "ℹ️ Informações",
    example: "🧪 Exemplos",
    group: "👥 Grupo",
    media: "🖼️ Mídia",
    admin: "🔐 Administração"
}

export const command: Command = {
    name: "menu",
    description: "Exibe o menu de comandos por categoria.",
    run: async (context) => {
        const groups = new Map<string, string[]>()
        const { commands, commandCategories } = getClient(context)

        for (const command of commands.values()) {
            const category = commandCategories.get(command.name) ?? "other"
            const lines = groups.get(category) ?? []

            lines.push(
                `• <code>${configHelper.commands.prefix}${command.name}</code> - ${escapeHtml(command.description)}`
            )
            groups.set(category, lines)
        }

        const fields = Array.from(groups.entries()).map(([category, lines]) => ({
            name: categoryLabels[category] ?? category,
            value: lines.join("\n")
        }))

        const menuEmbed = new Embed()
            .setAuthor({ name: context.botInfo.first_name, emoji: "🤖" })
            .setTitle("📋 Menu")
            .setDescription(`Olá ${escapeHtml(context.from?.first_name ?? "usuário")}, estes são os meus comandos:`)
            .setFields(fields)
            .setFooter({ text: "By Marcuth", emoji: "👨‍💻" })

        await context.replyWithHTML(menuEmbed.build())
    }
}
