"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const HttpException_1 = __importDefault(require("./exceptions/HttpException"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const userController = __importStar(require("./controller/user"));
const app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(cors_1.default());
app.use(helmet_1.default());
app.use(express_1.default.static(path_1.default.resolve(__dirname, 'public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 8000;
app.get('/', (_req, res) => {
    res.json({ success: true, message: 'hello world' });
});
app.get('/user/validate', userController.validate);
app.post('/user/register', userController.register);
app.post('/user/login', userController.login);
app.use((_req, _res, next) => {
    const error = new HttpException_1.default(404, '尚未为此路径分配路由');
    next(error);
});
app.use(errorMiddleware_1.default);
app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map