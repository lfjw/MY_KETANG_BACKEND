// TODO ts不能使用require 只能使用import from 

import express, { Express, Request, Response, NextFunction } from 'express';
// 加载环境变量，读取.env文件，写入process.env.JWT...
import "dotenv/config";
// 异常处理
import HttpException from './exceptions/HttpException';
// 错误中间件
import errorMiddleware from './middlewares/errorMiddleware';
// 连接数据库
import mongoose from 'mongoose'
//解决跨域
import cors from 'cors';
// 请求日志中间件，输出访问日志
import morgan from 'morgan';
// 可以解决xss等攻击，安全过滤
import helmet from 'helmet';

import path from 'path'
import *  as userController from './controller/user';

import * as sliderController from './controller/slider'
import * as lessonController from './controller/lesson';

import { Slider, Lesson } from './models'





import multer from "multer";
// 制定上传文件的存储空间
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public', 'uploads'),
  // Express.Multer.File
  // 扩展命名空间 express 
  /** 
   * namespace Express { 
   * namespace Multer { 
   * interface File {
   */
  filename(_req: Request, file: Express.Multer.File, callback) {
    // callback 第二个参数是文件名 时间戳.jpg
    callback(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })


const app: Express = express();

app.use(cors()); // 跨域
app.use(morgan("dev")); // 打印
app.use(helmet()); // 安全过滤
app.use(express.static(path.resolve(__dirname, 'public'))); // 图片访问
app.use(express.json()); // express.json = bodyParser.json
app.use(express.urlencoded({ extended: false })); // 


app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.json({ success: true, message: 'hello world' });
  //next() 此处不应该添加，会导致Cannot set headers after they are sent to the client
});

// 客户端把token 传给服务器，服务器返回当前的用户，如果token不合法或过期，则返回null
app.get('/user/validate', userController.validate);
app.post('/user/register', userController.register);
app.post('/user/login', userController.login);

/** 
 * 图片上传
 * 当服务器端接口的上传文件请求的时候，处理单文件上传，字段名avatar
 * request.file = Express.Multer.File
*/
app.post('/user/uploadAvatar', upload.single('avatar'), userController.uploadAvatar);


app.get('/slider/list', sliderController.list);
app.get('/lesson/list', lessonController.list);


// -- Start 传递异常信息 -- 
//没有匹配到任何路由，则会创建一个自定义404错误对象，并传递给错误处理中间件
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: HttpException = new HttpException(404, '尚未为此路径分配路由');
  next(error);
});
app.use(errorMiddleware);
// -- End 传递异常信息 -- 


(async function () {
  await mongoose.set('useNewUrlParser', true)
  await mongoose.set('useUnifiedTopology', true)
  // 数据库地址
  const MONGODB_URL = process.env.MONGODB_URL || `mongodb://localhost/`
  // 连接数据库
  await mongoose.connect(MONGODB_URL)


  await createInitialSliders()
  await createInitialLesson()

  const PORT: number = (process.env.PORT && parseInt(process.env.PORT)) || 8000;
  app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
})()


async function createInitialSliders() {
  // 查询数据库有没有数据
  const sliders = await Slider.find()
  if (sliders.length === 0) {
    const sliders = [
      { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592713276852&di=d0b2b9083f22a1cb0b7f8e715745b403&imgtype=0&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D1100172608%2C3877538389%26fm%3D214%26gp%3D0.jpg' },
      { url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1391526329,3726462108&fm=26&gp=0.jpg' },
      { url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3404221704,526751635&fm=26&gp=0.jpg' },
      { url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3532249801,4016244769&fm=26&gp=0.jpg' },
      { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592713297463&di=f3ee4e71e853b1a55dfe0ffd3cdf2168&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F58cbc7ded99ea8d687d391c44e9aeb457405e5e8b6625-DAAmw4_fw658' }
    ];
   await Slider.create(sliders);
  }
}



async function createInitialLesson() {
  const lessons = await Lesson.find()
  if (lessons.length === 0) {
    const lessons = [
      {
        order: 1,
        title: '1.React全栈架构',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥100.00元',
        category: 'react'
      },
      {
        order: 2,
        title: '2.React全栈架构',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥200.00元',
        category: 'react'
      },
      {
        order: 3,
        title: '3.React全栈架构',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥300.00元',
        category: 'react'
      },
      {
        order: 4,
        title: '4.React全栈架构',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥400.00元',
        category: 'react'
      },
      {
        order: 5,
        title: '5.React全栈架构',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥500.00元',
        category: 'react'
      },
      {
        order: 6,
        title: '6.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥100.00元',
        category: 'vue'
      },
      {
        order: 7,
        title: '7.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥200.00元',
        category: 'vue'
      },
      {
        order: 8,
        title: '8.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥300.00元',
        category: 'vue'
      },
      {
        order: 9,
        title: '9.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥400.00元',
        category: 'vue'
      },
      {
        order: 10,
        title: '10.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥500.00元',
        category: 'vue'
      },
      {
        order: 11,
        title: '11.React全栈架构',
        "video": "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥600.00元',
        category: 'react'
      },
      {
        order: 12,
        title: '12.React全栈架构',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥700.00元',
        category: 'react'
      },
      {
        order: 13,
        title: '13.React全栈架构',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥800.00元',
        category: 'react'
      },
      {
        order: 14,
        title: '14.React全栈架构',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥900.00元',
        category: 'react'
      },
      {
        order: 15,
        title: '15.React全栈架构',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/react/img/react.jpg",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/react.png',
        price: '¥1000.00元',
        category: 'react'
      },
      {
        order: 16,
        title: '16.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥600.00元',
        category: 'vue'
      },
      {
        order: 17,
        title: '17.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥700.00元',
        category: 'vue'
      },
      {
        order: 18,
        title: '18.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥800.00元',
        category: 'vue'
      },
      {
        order: 19,
        title: '19.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥900.00元',
        category: 'vue'
      },
      {
        order: 20,
        title: '20.Vue从入门到项目实战',
        video: "http://img.zhufengpeixun.cn/gee2.mp4",
        poster: "http://www.zhufengpeixun.cn/vue/img/vue.png",
        url: 'http://www.zhufengpeixun.cn/themes/jianmo2/images/vue.png',
        price: '¥1000.00元',
        category: 'vue'
      }
    ];
    await Lesson.create(lessons);
  }
}