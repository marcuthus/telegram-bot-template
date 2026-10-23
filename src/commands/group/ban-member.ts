import { z } from "zod"

import { requireChatAdmin } from "../../utils/command/require-chat-admin"
import { resolveTargetUser } from "../../utils/message/target-user"
import { escapeHtml } from "../../utils/message/escape-html"
import { Command } from "../../interfaces/command"

// Arguments are positional: `/ban_member [user_id]`, or reply to / mention (without @username) the user
const schema = z.object({
    user: z.string().optional()
})

export const command: Command<typeof schema> = {
    name: "ban_member",
    description: "Bane um membro do grupo (apenas administradores). Uso: responda uma mensagem com /ban_member",
    schema: schema,
    run: async (context, options) => {
        if (!(await requireChatAdmin(context))) return

        const target = resolveTargetUser(context, options.user)

        if (!target) {
            await context.reply("Responda a mensagem de quem deve ser banido ou informe o ID. Uso: /ban_member [id]")
            return
        }

        if (target.id === context.from?.id) {
            await context.reply("Você não pode banir a si mesmo.")
            return
        }

        try {
            await context.banChatMember(target.id)
            await context.replyWithHTML(`<b>${escapeHtml(target.name)}</b> foi removido do grupo.`)
        } catch (error) {
            await context.replyWithHTML(
                `Não foi possível banir <code>${target.id}</code>. O bot precisa ser administrador com permissão de banir. (${escapeHtml(String(error))})`
            )
        }
    }
}
