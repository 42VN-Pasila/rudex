# Background jobs (BullMQ)

This project uses BullMQ for background jobs. The repository includes a minimal queue setup in `src/queues` with a scheduler, worker, and a small producer helper.

Quick setup

- Install dependencies:

```bash
npm install bullmq ioredis
# or
yarn add bullmq ioredis
```

- Ensure Redis is available. Default connection: `redis://127.0.0.1:6379`.
  Set `REDIS_URL` to override.

What we added

- `src/queues/config.ts` — redis connection config.
- `src/queues/index.ts` — `initQueues()` and `closeQueues()` helpers and exported `getQueue()`.
- `src/queues/worker.ts` — example worker process function (handles `send-email`).
- `src/queues/producer.ts` — helper `addJob(name, data, opts)` to push jobs.

Usage

- Start the server normally (`node dist/server.js` or `npm run start`). The server initializes queues automatically.
- To enqueue a job from code:

```ts
import { addJob } from "../src/queues/producer";

await addJob("send-email", { to: "foo@example.com", subject: "Hello" });
```

Notes

- Worker code in `src/queues/worker.ts` is intentionally simple; replace with real business logic.
- The Worker runs inside the main process; for production, consider running the worker in a separate process to isolate CPU and memory.
