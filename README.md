This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Independent Node.js Data Backend

PersonaX includes a separate JSON-backed Node.js API foundation. It is independent from the Next.js UI and from all Telegram integration.

### Structure

- `data/`: relational JSON seed files for users, profiles, personas, categories, conversations, messages, memories, favorites, custom personas, multi-persona sessions, research sessions, and settings.
- `server/models/`: entity types and the replaceable JSON repository.
- `server/services/`: business rules and relationship checks.
- `server/controllers/`: request validation and response mapping.
- `server/routes/`: REST route definitions.
- `server/middleware/`: error and not-found handling.
- `server/config/`: environment configuration.
- `src/lib/api-client.ts`: configurable frontend API client for future UI integration.

### Run the API

Copy `.env.example` to `.env` and set environment values as needed. No passwords, API keys, or secret tokens belong in `data/`.

```bash
npm run server:dev
```

The API listens on `http://localhost:4000` by default. Use `npm run server:start` for a one-shot server process.

### Environment

- `PORT`: API port, default `4000`.
- `NODE_ENV`: runtime environment.
- `DATABASE_URL`: reserved for the future database adapter; unused by the JSON repository.
- `FRONTEND_ORIGIN`: allowed CORS origin, default `http://localhost:3000`.
- `DATA_DIR`: seed/data directory, default `./data`.
- `NEXT_PUBLIC_API_BASE_URL`: frontend API base URL, default `http://localhost:4000/api`.

### API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health |
| GET | `/api/personas` | List personas |
| GET | `/api/personas/:id` | Get one persona |
| GET | `/api/categories` | List categories |
| GET | `/api/users/:id` | Get a user |
| GET | `/api/users/:id/profile` | Get a user profile |
| GET | `/api/conversations/:userId` | List user conversations |
| GET | `/api/memories/:userId` | List user memories |
| GET | `/api/favorites/:userId` | List user favorites |
| POST | `/api/conversations` | Create a conversation |
| POST | `/api/messages` | Create a message |
| POST | `/api/memories` | Create a memory |
| POST | `/api/favorites` | Create a favorite |
| DELETE | `/api/favorites/:id` | Delete a favorite |

All responses use `{ "success": true, "data": ... }` or `{ "success": false, "error": { "message": "..." } }`. IDs and relationships are validated at the service boundary.

### Database migration path

The application calls service methods rather than reading JSON directly. To migrate to PostgreSQL, MongoDB, Supabase, or Firebase, implement the same repository/service contracts with a new adapter, move each JSON entity into a collection/table, preserve the IDs and relationships, and keep the route/controller layer unchanged.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
