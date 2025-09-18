# Sweet Shop Server

Backend API for the Sweet Shop application built with Express.js and Drizzle ORM.

## Tech Stack

- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Language**: TypeScript
- **Runtime**: Node.js

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your database credentials and other configuration values.

4. Generate database schema:
   ```bash
   npm run db:generate
   ```

5. Run database migrations:
   ```bash
   npm run db:migrate
   ```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript project
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
src/
├── controllers/     # Route controllers
├── db/             # Database configuration and schema
├── middleware/     # Custom middleware
├── routes/         # API route definitions
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## Environment Variables

See `.env.example` for required environment variables.