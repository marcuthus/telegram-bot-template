import { requireChatAdmin } from "../../utils/command/require-chat-admin"
import { Command } from "../../interfaces/command"

export const command: Command = {
    name: "invite",
    description: "Gera o link de convite do grupo (apenas administradores).",
    run: async (context) => {
        if (!(await requireChatAdmin(context))) return

        try {
            const link = await context.exportChatInviteLink()

            await context.reply(`Link de convite:\n${link}`)
        } catch {
            await context.reply(
                "Não foi possível gerar o link. O bot precisa ser administrador com permissão de convidar."
            )
        }
    }
}
