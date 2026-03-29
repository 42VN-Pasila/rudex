# Background Jobs (Bull)

This project uses [Bull](https://github.com/OptimalBits/bull) (v4) backed by Redis for background job processing.

## Setup

1. Start Redis via Docker Compose:

```bash
yarn db:up
```

2. Ensure `REDIS_URL` is set in `.env` (defaults to `redis://127.0.0.1:6379`).

## Architecture

```
src/queues/
├── config.ts              — Redis connection options
├── index.ts               — initQueues(), closeQueues(), getQueue()
├── jobTypes.ts            — Job type enum (queue names)
├── producer.ts            — addJob() helper to enqueue jobs
├── worker.ts              — Registers processors for each queue
└── processors/
    └── sendConfirmationEmail.ts — Handles confirmation email jobs
```

- **Queues are initialized** in `src/server.ts` on startup via `initQueues()`.
- **Queues are closed** on graceful shutdown via `closeQueues()`.
- **Workers run in-process** alongside the Fastify server.

## Job Types

| Queue Name | Payload | Trigger |
|---|---|---|
| `send-confirmation-email` | `{ userId, email, username }` | User registration |

## Enqueuing a Job

```ts
import { addJob } from '@src/queues/producer';
import { JobTypes } from '@src/queues/jobTypes';

await addJob(JobTypes.SendConfirmationEmail, {
  userId: 'abc-123',
  email: 'user@example.com',
  username: 'johndoe'
});
```

## Adding a New Job Type

1. Add a new entry to `JobTypes` enum in `src/queues/jobTypes.ts`
2. Create a processor in `src/queues/processors/`
3. Register it in `src/queues/worker.ts`
