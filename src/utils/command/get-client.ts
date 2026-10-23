import { ExtendedContext } from "../../interfaces/command"
import { Client } from "../../client"

export function getClient(context: ExtendedContext): Client {
    return context.state.client
}
