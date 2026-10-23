import { z } from "zod"

import { resolveTargetUser } from "../../utils/message/target-user"
import { escapeHtml } from "../../utils/message/escape-html"
import { Command } from "../../interfaces/command"

// Arguments are positional: `/id [user_id]`, or reply to / mention (without @username) a user
const schema = z.object({
    user: z.string().optional()
})

export const command: Command<typeof schema> = {
    name: "id",
    description: "Mostra o seu ID ou o de quem for respondido/mencionado. Uso: /id [id]",
    schema: schema,
    run: async (context, options) => {
        const target = resolveTargetUser(context, options.user)

        if (target) {
            await context.replyWithHTML(`O ID de <b>${escapeHtml(target.name)}</b> é <code>${target.id}</code>`)
            return
        }

        await context.replyWithHTML(`O seu ID de usuário é <code>${context.from?.id}</code>`)
    }
}
