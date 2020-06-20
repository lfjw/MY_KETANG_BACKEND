import { Request, Response, NextFunction } from 'express'

// import jwt from 'jsonwebtoken';
// import { UserPayload } from '../typings/jwt';
import { User, UserDocument } from '../models/user';
import { validateRegisterInput } from '../utils/validator'
import { UNPROCESSABLE_ENTITY, UNAUTHORIZED } from 'http-status-codes';
import HttpException from '../exceptions/HttpException';
import jwt from 'jsonwebtoken'
import { UserPayload } from 'src/typings/payload';

/**
 * 1 增加用户输入合法性的校验 减少服务器压力
 * 2 增加异常
 * 3 密码加密
 * 4 生成jwt token
 */
// 注册
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, confirmPassword, email } = req.body
  
  let { valid, errors } = validateRegisterInput(username, password, confirmPassword, email)

  try {
    if (!valid) {
      throw new HttpException(UNPROCESSABLE_ENTITY, '用户提交的参数不正确', errors)
    }
    // 查询用户名是否存在
    let oldUser: UserDocument | null = await User.findOne({ username })

    if (oldUser) {
      throw new HttpException(UNPROCESSABLE_ENTITY, '用户名重复', errors)
    }

    // 创建一个文档
    let user = new User({ username, password, confirmPassword, email })
    await user.save()
    res.json({
      success: true,
      data: user.toJSON()//user
      // TODO 真实数据不返回user
    })
  } catch (error) {
    next(error)
  }

}

// 登录
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body
    //let user = await User.findOne({ username })
    // 模型扩展方法， 封装一个方法，去校验用户名和密码，这里直接返回成功或者失败
    let user: UserDocument | null = await User.login(username, password)

    if (user) {
      // 模型实例扩展方法
      // 服务器端不保存 客户端保存
      let access_token = user.getAccessToke()

      res.json({
        success: true,
        data: access_token,//user
      })
    } else {
      throw new HttpException(UNAUTHORIZED, '登录失败')
    }
  } catch (error) {
    next(error)
  }
}


// 校验
export const validate = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  console.log(authorization);
  if (authorization) {
    const access_token = authorization.split(' ')[1];// Bearer
    // 此处会验证token过期时间
    if (access_token) {
      try {
        // TODO as 用法
        const UserPayload: UserPayload = jwt.verify(access_token, process.env.JWT_SECRET_KEY || 'jw') as UserPayload

        const user: UserDocument | null = await User.findById(UserPayload.id)
        if (user) {
          console.log(Object.keys(user), Object.keys(user._doc));
          res.json({
            success: true,
            data: user.toJSON() //user._doc // 得到自己的文档对象
          })
        } else {
          next(new HttpException(UNAUTHORIZED, '用户未找到'))
        }
      } catch (error) {
        next(new HttpException(UNAUTHORIZED, "access_token不正确"))
      }

    } else {
      next(new HttpException(UNAUTHORIZED, 'access_token未提供'))
    }

  } else {
    next(new HttpException(UNAUTHORIZED, 'authorization未提供'))
  }

}


// /**
//  * 登录校验
//  */
// export const validate = (req: Request, res: Response, next: NextFunction) => {
//   const authorization = req.headers.authorization;
//   if (!authorization) {
//     return next(new HttpException(UNAUTHORIZED, 'authorization未提供'));
//   }

//   console.log(res);

//   const access_token = authorization.split(' ')[1];//Bearer access_token

//   if (!access_token) {
//     return next(new HttpException(UNAUTHORIZED, 'access_token未提供'));
//   }

//   try {
//     const userPayload: UserPayload = jwt.verify(access_token, process.env.JWT_SECRET_KEY || 'jw') as UserPayload;
//     console.log(userPayload);
//   } catch (error) {
//     next(new HttpException(UNAUTHORIZED, 'access_token不正确'));
//   }
// }



// /**
//  * 上传头像
//  */
// export const uploadAvatar = () => {

// }

