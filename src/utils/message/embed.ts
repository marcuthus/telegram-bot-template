interface Field {
    name: string
    value: string
}

interface Author {
    name: string
    emoji: string
}

interface Footer {
    text: string
    emoji: string
}

export class Embed {
    private author = ""
    private title = ""
    private description = ""
    private fields = ""
    private timestamp = ""
    private footer = ""

    public setAuthor(author: Author) {
        this.author = `<b>${author.emoji} ${author.name}</b>`
        return this
    }

    public setTitle(title: string) {
        this.title = `<b>${title}</b>`
        return this
    }

    public setDescription(description: string) {
        this.description = description
        return this
    }

    public setFields(fields: Field[]) {
        this.fields = fields.map((field) => `<b>${field.name}:</b>\n${field.value}\n`).join("")
        return this
    }

    public setTimestamp(timestamp: Date = new Date()) {
        this.timestamp = `<i>${timestamp.toLocaleDateString("pt-br")}, ${timestamp.toLocaleTimeString("pt-br")}</i>`
        return this
    }

    public setFooter(footer: Footer) {
        this.footer = `<b><i>${footer.emoji} ${footer.text}</i></b>`
        return this
    }

    public build() {
        const bottom = [this.footer, this.timestamp].filter(Boolean).join(" | ")

        return [this.author, this.title, this.description, this.fields, bottom].filter(Boolean).join("\n\n").trim()
    }
}
