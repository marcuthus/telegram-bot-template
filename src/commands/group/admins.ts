import { isGroupChat } from "../../utils/command/require-chat-admin"
import { escapeHtml } from "../../utils/message/escape-html"
import { Command } from "../../interfaces/command"

export const command: Command = {
    name: "admins",
    description: "Lista os administradores do grupo e seus IDs.",
    run: async (context) => {
        if (!isGroupChat(context)) {
            await context.reply("Este comando só funciona em grupos.")
            return
        }

        const administrators = await context.getChatAdministrators()

        const lines = administrators.map((member, index) => {
            const crown = member.status === "creator" ? "👑 " : ""
            const username = member.user.username ? ` (@${member.user.username})` : ""

            return `${index + 1}. ${crown}${escapeHtml(member.user.first_name)}${escapeHtml(username)} - <code>${member.user.id}</code>`
        })

        await context.replyWithHTML(`<b>👥 Administradores (${lines.length}):</b>\n\n${lines.join("\n")}`)
    }
}
