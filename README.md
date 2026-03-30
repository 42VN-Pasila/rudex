# 🧱 Rudex – Authentication & Authorization Service

Rudex is a microservice responsible for **authentication, authorization, and user management**.  
It follows a **Clean Architecture** approach with strict separation of concerns between domain, use cases, infrastructure, and delivery layers.

---

## 🚀 Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Fastify
- **Database:** PostgreSQL (via Kysely query builder + Knex migrations)
- **Architecture:** Clean Architecture / Hexagonal
- **API Contract:** OpenAPI (spec-first approach)
- **Logging:** Pino with pretty output in development
- **Package manager:** Yarn

---

## 📁 Project Structure

```
rudex/
├─ src/
│ ├─ app.ts # Fastify app setup
│ ├─ server.ts # App entrypoint
│ ├─ domain/ # Entities, domain errors, and core logic
│ ├─ useCases/ # Application use cases (e.g., loginUser)
│ ├─ repositories/ # Repository interfaces & implementations
│ ├─ mappers/ # Domain ↔ persistence mapping
│ ├─ database.ts # Kysely client & Knex migration helper
│ ├─ schema.ts # Generated DB types (kysely-codegen)
│ ├─ routes/ # Fastify route definitions
│ ├─ gen/ # Auto-generated OpenAPI types
│ └─ logger.ts # Pino logger configuration
├─ migrations/ # Knex SQL migrations
├─ docs/
│ └─ openapi.yml # API definition (source of truth)
├─ tests/ # Unit & integration tests
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## ⚙️ Environment Setup

### 1. Setup environment

Create a `.env` file in the project root from the `.env.local`

### 2. Project setup

```bash
yarn
yarn gen
```

## 🧩 Development

Run the app

```bash
yarn dev
```

Run the worker

```bash
yarn dev:worder
```

## 🧪 Testing

Run unit tests

```bash
yarn test
```

Run integration tests

```bash
yarn test:e2e
```

## 🧠 Architectural Overview

Clean Architecture Layers

| Layer            | Description                                   |
| ---------------- | --------------------------------------------- |
| **Domain**       | Core business entities and domain rules       |
| **Use Cases**    | Application-specific logic                    |
| **Repositories** | Data access                                   |
| **Mappers**      | Translates between domain object to DTO       |
| **Controllers**  | Handle incoming requests and map to use cases |
