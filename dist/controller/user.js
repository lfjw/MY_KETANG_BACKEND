"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.login = exports.register = exports.validate = void 0;
const http_status_codes_1 = require("http-status-codes");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.validate = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return next(new HttpException_1.default(http_status_codes_1.UNAUTHORIZED, 'authorization未提供'));
    }
    console.log(res);
    const access_token = authorization.split(' ')[1];
    if (!access_token) {
        return next(new HttpException_1.default(http_status_codes_1.UNAUTHORIZED, 'access_token未提供'));
    }
    try {
        const userPayload = jsonwebtoken_1.default.verify(access_token, process.env.JWT_SECRET_KEY || 'jw');
        console.log(userPayload);
    }
    catch (error) {
        next(new HttpException_1.default(http_status_codes_1.UNAUTHORIZED, 'access_token不正确'));
    }
};
exports.register = () => {
};
exports.login = (req, res, next) => {
    const { username, password } = req.body;
    console.log(username, password, res);
    next(new HttpException_1.default(http_status_codes_1.UNAUTHORIZED, 'access_token不正确'));
};
exports.uploadAvatar = () => {
};
//# sourceMappingURL=user.js.map