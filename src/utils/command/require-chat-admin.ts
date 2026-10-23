import { ExtendedContext } from "../../interfaces/command"
import { escapeHtml } from "../message/escape-html"

import { isBotOwnerId } from "./is-owner-id"

export function isGroupChat(context: ExtendedContext) {
    return context.chat?.type === "group" || context.chat?.type === "supergroup"
}

export async function requireChatAdmin(context: ExtendedContext) {
    if (!isGroupChat(context)) {
        await context.reply("Este comando só funciona em grupos.")
        return false
    }

    const authorId = context.from?.id

    if (!authorId) return false

    const member = await context.getChatMember(authorId)
    const isChatAdmin = member.status === "creator" || member.status === "administrator"

    if (!isChatAdmin && !isBotOwnerId(String(authorId))) {
        await context.replyWithHTML(
            `<pre>Permission Error:\n${escapeHtml(context.from?.first_name ?? "usuário")}, você não possui permissão para usar este comando.</pre>`
        )
        return false
    }

    return true
}
