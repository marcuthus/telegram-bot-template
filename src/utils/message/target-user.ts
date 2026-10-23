import { User } from "telegraf/types"

import { ExtendedContext } from "../../interfaces/command"

export interface TargetUser {
    id: number
    name: string
}

function describe(user: User): TargetUser {
    return { id: user.id, name: user.username ? `@${user.username}` : user.first_name }
}

// Priority: replied message author, then a text mention (users without @username), then a numeric ID argument.
export function resolveTargetUser(context: ExtendedContext, idArgument?: string): TargetUser | undefined {
    const message = context.message

    if (message && "reply_to_message" in message && message.reply_to_message?.from) {
        return describe(message.reply_to_message.from)
    }

    const entities = message && "entities" in message ? message.entities : undefined
    const mention = entities?.find((entity) => entity.type === "text_mention")

    if (mention && "user" in mention) return describe(mention.user)

    if (idArgument && /^\d+$/.test(idArgument)) return { id: Number(idArgument), name: idArgument }

    return undefined
}
