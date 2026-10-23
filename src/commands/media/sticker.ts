import sharp from "sharp"
import { z } from "zod"

import { ExtendedContext } from "../../interfaces/command"
import { Command } from "../../interfaces/command"

const stickerSize = 512

const lowercase = (value: unknown) => (typeof value === "string" ? value.toLowerCase() : value)

// Arguments are positional: `/sticker [crop] [center]`
//   crop:   true (default) fills the square and crops the overflow, false fits the whole image
//           with transparent bars, dented stretches the image to the square (squashed).
//   center: true (default) centers the crop/image, false anchors it to the top-left corner.
const schema = z.object({
    crop: z.preprocess(lowercase, z.enum(["true", "false", "dented"])).optional(),
    center: z.preprocess(lowercase, z.enum(["true", "false"])).optional()
})

type StickerOptions = z.infer<typeof schema>

function createStickerTransform(options: StickerOptions) {
    const position = options.center === "false" ? "left top" : "centre"

    if (options.crop === "dented") {
        return sharp().resize(stickerSize, stickerSize, { fit: "fill" })
    }

    if (options.crop === "false") {
        return sharp().resize(stickerSize, stickerSize, {
            fit: "contain",
            position: position,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
    }

    return sharp().resize(stickerSize, stickerSize, { fit: "cover", position: position })
}

export async function createSticker(image: Buffer, options: StickerOptions) {
    return sharp(image)
        .pipelineColourspace("srgb")
        .ensureAlpha()
        .pipe(createStickerTransform(options))
        .webp({ quality: 75 })
        .toBuffer()
}

function findImageFileId(context: ExtendedContext) {
    const message = context.message

    if (!message) return undefined

    const sources = [message, "reply_to_message" in message ? message.reply_to_message : undefined]

    for (const source of sources) {
        if (!source) continue

        if ("photo" in source && source.photo?.length) return source.photo[source.photo.length - 1].file_id

        if ("document" in source && source.document?.mime_type?.startsWith("image/")) return source.document.file_id
    }

    return undefined
}

export const command: Command<typeof schema> = {
    name: "sticker",
    description:
        "Cria uma figurinha a partir de uma imagem (legenda ou resposta). Uso: /sticker [crop: true|false|dented] [center: true|false]",
    schema: schema,
    run: async (context, options) => {
        const fileId = findImageFileId(context)

        if (!fileId) {
            await context.reply("Envie uma foto com a legenda /sticker ou responda uma foto com /sticker.")
            return
        }

        const link = await context.telegram.getFileLink(fileId)
        const response = await fetch(link.href)
        const image = Buffer.from(await response.arrayBuffer())

        const sticker = await createSticker(image, options)

        await context.replyWithSticker({ source: sticker, filename: "sticker.webp" })
    }
}
