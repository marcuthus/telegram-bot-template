import { Command } from "../../interfaces/command"

export const command: Command = {
    name: "chat_id",
    description: "Mostra o ID do chat ou grupo atual.",
    run: async (context) => {
        const title = context.chat && "title" in context.chat ? ` (${context.chat.title})` : ""

        await context.replyWithHTML(`O ID deste chat${title} é <code>${context.chat?.id}</code>`)
    }
}
