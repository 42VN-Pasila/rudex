# 🧱 Rudex – Authentication & Authorization Service

Rudex is a microservice responsible for **authentication, authorization, and user management**.  
It follows a **Clean Architecture** approach with strict separation of concerns between domain, use cases, infrastructure, and delivery layers.

---

## 🚀 Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Fastify
- **Database:** SQLite (via Prisma ORM)
- **Architecture:** Clean Architecture / Hexagonal
- **API Contract:** OpenAPI (spec-first approach)
- **Logging:** Pino with pretty output in development
- **Package manager:** Yarn

---

## 📁 Project Structure

rudex/
├─ src/
│ ├─ app.ts # Fastify app setup
│ ├─ server.ts # App entrypoint
│ ├─ domain/ # Entities, domain errors, and core logic
│ ├─ useCases/ # Application use cases (e.g., loginUser)
│ ├─ repositories/ # Repository interfaces & implementations
│ ├─ mappers/ # Domain ↔ persistence mapping
│ ├─ db/ # Prisma client setup
│ ├─ routes/ # Fastify route definitions
│ ├─ gen/ # Auto-generated OpenAPI types
│ └─ logger.ts # Pino logger configuration
├─ prisma/
│ └─ schema.prisma # Prisma data model
├─ docs/
│ └─ openapi.yml # API definition (source of truth)
├─ tests/ # Unit & integration tests
├─ package.json
├─ tsconfig.json
└─ README.md

---

## ⚙️ Environment Setup

### 1. Project setup

```bash
yarn install
yarn gen
```

### 2. Setup environment

Create a `.env` file in the project root from the `.env.local`

## 🧩 Development

Run the app

```bash
yarn dev
```

## 🧪 Testing

Run unit tests (Not implemented)

```bash
yarn test
```

Run integration tests (Not implemented)

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
