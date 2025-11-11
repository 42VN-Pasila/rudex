"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function signJwt(payload, expiresInSec) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiresInSec });
}
async function verifyJwt(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    return typeof decoded === 'object' ? decoded : null;
}
//# sourceMappingURL=jwt.js.map