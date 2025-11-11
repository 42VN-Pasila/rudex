"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLUserRepo = void 0;
const error_1 = require("@domain/error");
const prisma_1 = __importDefault(require("@src/db/prisma"));
const userMapper_1 = require("@src/mappers/userMapper");
class SQLUserRepo {
    async getById(userId) {
        const dbRecord = await prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!dbRecord) {
            throw error_1.UserNotFoundError.create(userId);
        }
        return userMapper_1.UserMapper.prismaToDomain(dbRecord);
    }
    async getByGoogleUserId(googleUserId) {
        const dbRecord = await prisma_1.default.user.findUnique({
            where: { googleUserId }
        });
        if (!dbRecord) {
            return null;
        }
        return userMapper_1.UserMapper.prismaToDomain(dbRecord);
    }
    async checkExistsByUsername(username) {
        const dbRecord = await prisma_1.default.user.findUnique({
            where: { username }
        });
        if (!dbRecord) {
            return null;
        }
        return userMapper_1.UserMapper.prismaToDomain(dbRecord);
    }
    async save({ username, password, googleUserId, googleUserName, refreshToken }) {
        const now = new Date();
        const dbRecord = await prisma_1.default.user.upsert({
            where: { username },
            create: {
                username,
                password: password ?? null,
                googleUserId: googleUserId ?? null,
                googleUserName: googleUserName ?? null,
                refreshToken: refreshToken ?? null,
                createdAt: now,
                updatedAt: now
            },
            update: {
                password: password ?? undefined,
                googleUserId: googleUserId ?? undefined,
                googleUserName: googleUserName ?? undefined,
                refreshToken: refreshToken ?? undefined,
                updatedAt: now
            }
        });
        return userMapper_1.UserMapper.prismaToDomain(dbRecord);
    }
}
exports.SQLUserRepo = SQLUserRepo;
//# sourceMappingURL=sqlUserRepo.js.map