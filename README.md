# PersonaX AI

PersonaX is a Next.js application backed by PostgreSQL for accounts, secure sessions, profiles, favorite personas, and liked messages.

## Local setup

1. Copy `.env.example` to `.env` and set a real `DATABASE_URL`.
2. Set `ADMIN_EMAIL` to the email that should access `/admin`.
3. Create the empty PostgreSQL database named in the connection URL.
4. Install dependencies and apply the schema:

```bash
npm install
npm run db:migrate
```

4. Start the application:

```bash
npm run dev -- -p 3000
```

The admin dashboard is available at `/admin` after logging in with the account whose email matches `ADMIN_EMAIL`. It reports page views, countries, devices, browsers, and popular paths from the analytics events table.

## Database

Migration files live in `database/migrations` and are applied in filename order. Applied migrations are recorded in `schema_migrations`, so `npm run db:migrate` is safe to run again during deployment.

The database contains normalized tables for:

- `users`: account identity and bcrypt password hashes
- `sessions`: hashed, expiring session tokens
- `profiles`: public profile fields and avatar
- `favorite_personas`: a user's persona collection
- `liked_messages`: saved AI responses

Authentication uses a random server session stored in an HttpOnly, SameSite cookie. Raw session tokens and passwords are never stored in PostgreSQL.

## Verification

```bash
npm run lint -- --quiet
npm run build
```

For production, set `DATABASE_URL` in the hosting provider, run `npm run db:migrate` during deployment, and serve the site over HTTPS.
