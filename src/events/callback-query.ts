import { createScopedLogger } from "../helpers/logger.helper"
import { Event } from "../interfaces/event"

const logger = createScopedLogger("client")

export const event: Event = {
    name: "callback_query",
    type: "on",
    run: async (context) => {
        logger.info("Callback query received.", { callbackQuery: context.callbackQuery })
    }
}
