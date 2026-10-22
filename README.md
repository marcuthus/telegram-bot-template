# Telegram Bot Template 🚀

Um template robusto e moderno para criação de bots de Telegram utilizando **TypeScript**, **Telegraf** e as melhores práticas de desenvolvimento.

## ✨ Funcionalidades

- 🛡️ **TypeScript**: Desenvolvimento totalmente tipado para evitar erros em runtime.
- 📂 **Auto-loading**: Sistema automático para carregar comandos e eventos.
- 📝 **Winston Logging**: Logs profissionais com escopos, cores no console e salvamento em arquivos (`logs/`).
- 🎨 **Qualidade de Código**: Configuração rigorosa de **ESLint 9** e **Prettier**.
    - Ordenação de imports por tamanho de linha.
    - Remoção automática de imports não utilizados.
    - Estilo consistente (4 espaços, sem ponto e vírgula, aspas duplas).
- 🧩 **Argumentos tipados**: Validação posicional de argumentos com [`@marcuth/argus`](https://www.npmjs.com/package/@marcuth/argus) e **Zod**.
- ⚙️ **Gestão de Variáveis**: Integração com `@marcuth/env` para um gerenciamento seguro do `.env`.

## 🛠️ Pré-requisitos

- [Node.js](https://nodejs.org/) (v18.x ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- Um bot criado com o [@BotFather](https://t.me/BotFather)

## 🚀 Instalação e Início

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/telegram-bot-template.git
    cd telegram-bot-template
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure o ambiente:**
    Renomeie o arquivo `.env.example` para `.env` e preencha as variáveis:

    ```env
    TELEGRAM_BOT_TOKEN=token_do_botfather
    TELEGRAM_ADMIN_ID=seu_id_de_usuario_telegram
    ```

4.  **Inicie o bot:**

    ```bash
    # Modo desenvolvimento
    npm run dev

    # Modo desenvolvimento com auto-reload (nodemon)
    npm run dev:reload

    # Build para produção
    npm run build
    npm start
    ```

## 📜 Scripts Disponíveis

| Comando              | Descrição                                             |
| -------------------- | ----------------------------------------------------- |
| `npm run dev`        | Executa o bot em modo de desenvolvimento.             |
| `npm run dev:reload` | Executa o bot com Nodemon para reiniciar ao salvar.   |
| `npm run build`      | Compila o TypeScript para JavaScript (pasta `dist/`). |
| `npm start`          | Inicia o bot compilado.                               |
| `npm run lint`       | Verifica erros de linting.                            |
| `npm run lint:fix`   | Corrige erros de linting e formata o código.          |

## 📁 Estrutura de Pastas

```text
src/
├── client.ts        # Criação e ciclo de vida do cliente
├── commands/        # Comandos
├── enums/           # Enums globais
├── events/          # Handlers de eventos do Telegram
├── handlers/        # Carregadores automáticos
├── helpers/         # Auxiliares (config, logger, argus)
├── interfaces/      # Definições de tipos e interfaces
└── utils/           # Utilitários
```

## ⚖️ Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ❤️ por [Marcuth](https://github.com/marcuth)
