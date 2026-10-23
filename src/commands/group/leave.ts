import { requireChatAdmin } from "../../utils/command/require-chat-admin"
import { Command } from "../../interfaces/command"

export const command: Command = {
    name: "leave",
    description: "Faz o bot sair do grupo (apenas administradores).",
    run: async (context) => {
        if (!(await requireChatAdmin(context))) return

        await context.reply("Até mais! 👋")
        await context.leaveChat()
    }
}
