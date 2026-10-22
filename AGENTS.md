# AGENTS.md - Telegram Bot Template

## Build/Lint/Test Commands

### Development

- `npm run dev` - Run bot in development mode with ts-node
- `npm run dev:reload` - Run with nodemon for auto-reload
- `npm run build` - Compile TypeScript to JavaScript (outputs to `./dist/`)
- `npm start` - Run compiled bot from `./dist/`

### Linting

- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint with auto-fix

### Testing

- No test framework is currently configured in this project
- To add tests, consider jest, vitest, or similar frameworks
- Example test command (once configured): `npm test` or `npm test -- path/to/file.test.ts`

### Type Checking

- `npx tsc --noEmit` - Run TypeScript compiler for type checking without emitting files

## Code Style Guidelines

### Imports

**Import Order (enforced by eslint-plugin-perfectionist):**

1. Node.js builtin modules (`path`, `fs`) - use `node:` prefix (e.g., `node:path`, `node:fs`)
2. External packages (`telegraf`, `winston`)
3. Internal modules (absolute imports from `src/`)
4. Parent directory imports
5. Sibling file imports
6. Index/file imports

**Import Format:**

```typescript
import path from "node:path"
import fs from "node:fs"

import * as telegraf from "telegraf"
import winston from "winston"

import { createScopedLogger } from "../../helpers/logger.helper"
import { Command } from "../interfaces/command"
import { Client } from "../index"
```

- Use blank lines between import groups
- Use `import * as` for telegraf to namespace all exports
- Use named imports for internal modules
- Avoid default imports except for configured packages

### Formatting

- **Prettier** is enforced via eslint-plugin-prettier
- **ESLint** config: `eslint.config.mjs`
- Run `npm run lint:fix` to auto-format code
- Trailing commas: preserve
- Semicolons: required
- Quotes: double quotes (default)

### Types

- **TypeScript** with strict mode enabled (`"strict": true` in tsconfig.json)
- Target: ES2016
- Module system: CommonJS (`"module": "commonjs"`)
- Always use explicit type annotations for function parameters and return types
- Export interfaces and types for reusable structures
- Use `ExtendedContext` for command contexts (alias of `telegraf.Context`)

```typescript
// Example type definitions
type RunFunc<T extends z.ZodObject> = (context: ExtendedContext, options: z.infer<T>) => Promise<void>

export interface Command<T extends z.ZodObject = z.ZodObject> {
    name: string
    description: string
    schema?: T
    run: RunFunc<T>
}
```

### Naming Conventions

- **Files**: kebab-case (e.g., `ping.ts`, `interaction-create.ts`, `command.interface.ts`)
- **Directories**: kebab-case (e.g., `commands/`, `events/`, `handlers/`)
- **Interfaces**: PascalCase with descriptive names (e.g., `Command`, `Event`, `ExtendedContext`)
- **Types**: PascalCase (e.g., `RunFunc`)
- **Enums**: PascalCase with singular form (e.g., `EventType`)
- **Variables/Functions**: camelCase (e.g., `commandName`, `handleCommands`)
- **Constants**: camelCase or UPPER_SNAKE_CASE for true constants
- **Classes**: PascalCase (e.g., `Client`)
- **Methods**: camelCase (e.g., `createClient`, `start`, `stop`)

### Error Handling

- Use try-catch blocks in async command/event handlers
- Log errors using the scoped logger: `createScopedLogger("scope")`
- Provide user-friendly error messages in Telegram replies
- Throw errors for invalid configurations with descriptive messages

```typescript
try {
    logger.info(`Running the command '${command.name}'.`)
    await command.run(context, options)
} catch (error) {
    logger.error(error)
    await context.reply(`Ocorreu um erro ao tentar executar o comando \`${command.name}\`!`)
}
```

### Telegram Bot Patterns

**Commands Structure:**

- Place commands in `src/commands/<category>/<command-name>.ts`
- Export a `command` object with `name`, `description`, optional `schema` and a `run` function
- Arguments are positional (`/command arg1 arg2`) and validated with [`@marcuth/argus`](https://www.npmjs.com/package/@marcuth/argus) + `zod`: declare a `schema` (`z.object({...})`) whose keys map to the arguments in order, and type the command as `Command<typeof schema>` to get typed `options` in `run`. Argus/Zod errors are reported to the user automatically
- Commands are synchronized with Telegram (`setMyCommands`) on startup
- Replies use HTML parse mode; escape user input with `escapeHtml`

**Events Structure:**

- Place events in `src/events/<event-name>.ts`
- Export an `event` object with `name` (a Telegram update type), `type` (`"on"`, `"once"`), and `run` function
- Event types defined in `src/enums/event-type.enum.ts`

**Client Pattern:**

- Use factory function `createClient()` instead of direct instantiation
- Client class (`src/client.ts`) extends `telegraf.Telegraf` with a custom `commands` property
- Handlers in `src/handlers/` automatically load commands and events

### Configuration

- Environment variables loaded via `@marcuth/env` package
- Config helper at `src/helpers/config.helper.ts`
- Required env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_ID`

### Logging

- Use `winston` for logging with scoped loggers
- Import: `import { createScopedLogger } from "../../helpers/logger.helper"`
- Create scoped logger: `const logger = createScopedLogger("scope-name")`
- Log levels: `logger.error()`, `logger.info()`, `logger.warn()`, `logger.debug()`
- Logs output to console and files in `logs/` directory
