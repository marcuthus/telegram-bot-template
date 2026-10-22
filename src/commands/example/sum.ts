import { z } from "zod"

import { escapeHtml } from "../../utils/message/escape-html"
import { Command } from "../../interfaces/command"

// Arguments are positional: `/sum <a> <b> [label]`
const schema = z.object({
    a: z.coerce.number(),
    b: z.coerce.number(),
    label: z.string().optional()
})

export const command: Command<typeof schema> = {
    name: "sum",
    description: "Soma dois números. Uso: /sum <a> <b> [rótulo]",
    schema: schema,
    run: async (context, options) => {
        const result = options.a + options.b
        const label = options.label ? ` (${escapeHtml(options.label)})` : ""

        await context.replyWithHTML(`<code>${options.a} + ${options.b} = ${result}</code>${label}`)
    }
}
