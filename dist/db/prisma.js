"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const client_1 = require("../gen/db/prisma/client");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const config_1 = require("@src/config");
const databaseUrl = config_1.configuration.database.url;
if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Prisma client initialization');
}
const adapter = new adapter_better_sqlite3_1.PrismaBetterSQLite3({ url: databaseUrl });
const sql = new client_1.PrismaClient({ adapter }).$extends((0, extension_accelerate_1.withAccelerate)());
exports.default = sql;
//# sourceMappingURL=prisma.js.map