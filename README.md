# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Chat Mock API

This project includes a ChatGPT-like mock flow with persistence in SQLite.

### Database schema

- `conversations`: chat thread metadata (`id`, `title`, timestamps)
- `messages`: thread messages (`conversation_id`, `role`, `content`, `created_at`)
- Relation: one `conversation` has many `messages` (cascade delete enabled)

Apply schema changes:

```bash
npx drizzle-kit push
```

### Seed commands

Seed conversations:

```bash
curl -X GET http://localhost:3000/_nitro/tasks/seed:conversations
```

Seed messages:

```bash
curl -X GET http://localhost:3000/_nitro/tasks/seed:messages
```

### API endpoints

- `POST /api/conversations` - create conversation
- `GET /api/conversations` - list conversations (paginated envelope)
- `GET /api/conversations/:id` - get one conversation with messages
- `PUT /api/conversations/:id` - update title
- `DELETE /api/conversations/:id` - delete conversation
- `POST /api/chat/messages` - append user message + store dummy assistant reply

Sample chat payload:

```json
{
  "conversationId": 1,
  "content": "Help me plan my week"
}
```

### UI flow

- Open `http://localhost:3000/chat`
- Create or select a conversation
- Send messages through the composer
- Messages are persisted and assistant replies are dummy responses
