import createClient from "./client"

async function start() {
    const client = createClient()

    process.once("SIGINT", () => client.stop("SIGINT"))
    process.once("SIGTERM", () => client.stop("SIGTERM"))

    await client.start()
}

start()
