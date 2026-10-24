import { z } from "zod"

import { requireChatAdmin } from "../../utils/command/require-chat-admin"
import { resolveTargetUser } from "../../utils/message/target-user"
import { isBotOwnerId } from "../../utils/command/is-owner-id"
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

        // O bot bane com as próprias permissões: sem checar o alvo, um administrador comum poderia
        // remover outros administradores (ou o dono) que o bot tenha permissão de banir.
        if (target.id === context.botInfo.id) {
            await context.reply("Não posso banir a mim mesmo.")
            return
        }

        const targetMember = await context.getChatMember(target.id).catch(() => null)
        const author = await context.getChatMember(context.from!.id)
        const targetIsStaff = targetMember?.status === "creator" || targetMember?.status === "administrator"

        if (targetIsStaff && author.status !== "creator" && !isBotOwnerId(String(context.from!.id))) {
            await context.reply("Apenas o criador do grupo pode banir outro administrador.")
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
