import { env } from "@marcuth/env"

export const configHelper = {
    commands: {
        prefix: "/",
        argumentsSeparator: " "
    },
    token: env("TELEGRAM_BOT_TOKEN"),
    admin: {
        id: env("TELEGRAM_ADMIN_ID")
    }
}
