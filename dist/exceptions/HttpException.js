"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, message, errors) {
        super();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}
exports.default = HttpException;
//# sourceMappingURL=HttpException.js.map