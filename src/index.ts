import express, { Express, Request, Response, NextFunction } from 'express';
// 加载环境变量
import "dotenv/config";
// 异常处理
import HttpException from './exceptions/HttpException';
// 解决跨域
import cors from 'cors';
// 请求日志中间件
import morgan from 'morgan';
// 可以解决xss等攻击
import helmet from 'helmet';

import path from 'path'

import errorMiddleware from './middlewares/errorMiddleware';

import *  as userController from './controller/user';

const app: Express = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT: number = (process.env.PORT && parseInt(process.env.PORT)) || 8000;

app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'hello world' });
});

app.get('/user/validate', userController.validate);
app.post('/user/register', userController.register);
app.post('/user/login', userController.login);



app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: HttpException = new HttpException(404, '尚未为此路径分配路由');
  next(error);
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});