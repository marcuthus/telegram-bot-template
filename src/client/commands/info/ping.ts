import { Command } from "../../interfaces/command"
import { Embed } from "../../utils/message/embed"

export const command: Command = {
    name: "ping",
    description: "Envia o ping do bot.",
    run: async (context) => {
        const startTime = Date.now()

        const sent = await context.reply("Calculando ping...")

        const ping = Date.now() - startTime

        const pingEmbed = new Embed()
            .setAuthor({ name: context.botInfo.first_name, emoji: "🤖" })
            .setTitle("🏓 Pong!")
            .setDescription(`Olá @${context.from?.username}, meu ping está em <code>${ping}ms</code>`)
            .setTimestamp()
            .setFooter({ text: "By Marcuth", emoji: "👨‍💻" })

        await context.telegram.editMessageText(sent.chat.id, sent.message_id, undefined, pingEmbed.build(), {
            parse_mode: "HTML"
        })
    }
}
