// TODO ts不能使用require 只能使用import from 

import express, { Express, Request, Response, NextFunction } from 'express';
// 加载环境变量，读取.env文件，写入process.env.JWT...
import "dotenv/config";
// 异常处理
import HttpException from './exceptions/HttpException';
// 连接数据库
import mongoose from 'mongoose'
// 解决跨域
import cors from 'cors';
// 请求日志中间件，输出访问日志
import morgan from 'morgan';
// 可以解决xss等攻击，安全过滤
import helmet from 'helmet';
import multer from "multer";
import path from 'path'
// 错误中间件
import errorMiddleware from './middlewares/errorMiddleware';
import *  as userController from './controller/user';


const app: Express = express();


app.use(cors()); // 跨域
app.use(morgan("dev")); // 打印
app.use(helmet()); // 安全过滤
app.use(express.static(path.resolve(__dirname, 'public'))); // 图片访问
app.use(express.json()); // express.json = bodyParser.json
app.use(express.urlencoded({ extended: false })); // 


app.get('/', (_req: Request, res: Response, next: NextFunction) => {
  res.json({ success: true, message: 'hello world' });
  next()
});

app.get('/user/validate', userController.validate);
app.post('/user/register', userController.register);
app.post('/user/login', userController.login);



app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: HttpException = new HttpException(404, '尚未为此路径分配路由');
  next(error);
});


app.use(errorMiddleware);
(async function () {
  await mongoose.set('useNewUrlParser', true)
  await mongoose.set('useUnifiedTopology', true)
  // 数据库地址
  const MONGODB_URL = process.env.MONGODB_URL || `mongodb://localhost/`
  // 连接数据库
  await mongoose.connect(MONGODB_URL)

  const PORT: number = (process.env.PORT && parseInt(process.env.PORT)) || 8000;
  app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
})