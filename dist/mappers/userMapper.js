"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static prismaToDomain(u) {
        return {
            id: u.id,
            username: u.username,
            password: u.password ?? undefined,
            googleUserId: u.googleUserId ?? undefined,
            googleUserName: u.googleUserName ?? undefined,
            accessToken: u.accessToken ?? undefined,
            accessTokenExpiryDate: u.accessTokenExpiryDate ?? undefined,
            refreshToken: u.refreshToken ?? undefined,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt
        };
    }
    static toResponseDto(u) {
        if (!u.accessToken || !u.refreshToken || !u.accessTokenExpiryDate) {
            throw new Error('User domain object is missing required token fields');
        }
        return {
            userId: u.userId,
            accessToken: u.accessToken,
            accessTokenExpiryDate: u.accessTokenExpiryDate.toISOString(),
            refreshToken: u.refreshToken
        };
    }
}
exports.UserMapper = UserMapper;
//# sourceMappingURL=userMapper.js.map