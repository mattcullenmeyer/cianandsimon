# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Install dependencies**: `pnpm install` (uses pnpm@10.28.0)
- **Dev server**: `pnpm dev` — runs on http://localhost:3000 with hot-reload via tsx watch
- **Build**: `pnpm build` — compiles TypeScript to `dist/`
- **No test framework is configured yet**

## Architecture

This is a TypeScript Express.js backend with dual deployment targets:

- **Local development** (`src/local.ts`): Starts Express on port 3000
- **AWS Lambda** (`src/lambda.ts`): Wraps Express with `@vendia/serverless-express` and exports a `handler`

Both entry points import the shared Express app from `src/server.ts`, which defines middleware (JSON parsing, Pino HTTP logging) and routes.

### Key libraries
- **Express v5** for HTTP routing
- **Pino** for structured logging (configured in `src/logger.ts`)
- **Zod v4** for schema validation

### TypeScript
- Strict mode with all strict flags enabled
- `noUnusedLocals` and `noUnusedParameters` are enforced
- Target ES2022, module system NodeNext
