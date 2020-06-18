"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorMiddleware = (err, _req, res, _next) => {
    let result = {
        success: false,
        message: err.message
    };
    if (err.errors && Object.keys(err.errors).length > 0) {
        result.errors = err.errors;
    }
    res.status(err.status || http_status_codes_1.INTERNAL_SERVER_ERROR)
        .json(result);
};
exports.default = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map