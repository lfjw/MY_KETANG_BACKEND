import { Request, Response, NextFunction } from 'express'
import { UNAUTHORIZED } from 'http-status-codes';
import HttpException from '../exceptions/HttpException';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../typings/jwt';
// import { UserDocument} from '../typings/user';
// import { User } from '../models/user';

/**
 * 登录校验
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if(!authorization){
    return next(new HttpException(UNAUTHORIZED, 'authorization未提供')); 
  }

  console.log(res);
  
  const access_token = authorization.split(' ')[1];//Bearer access_token

  if (!access_token){
    return next(new HttpException(UNAUTHORIZED, 'access_token未提供'));
  }

  try {
    const userPayload: UserPayload = jwt.verify(access_token, process.env.JWT_SECRET_KEY || 'jw') as UserPayload;
    console.log(userPayload);
  } catch (error) {
    next(new HttpException(UNAUTHORIZED, 'access_token不正确'));
  }
}


/**
 * 注册
 */
export const register = () => {

}


/**
 * 登录
 */
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  console.log(username, password, res);
  



  next(new HttpException(UNAUTHORIZED, 'access_token不正确'));
  // try {
  //   let { username, password } = req.body;
  //   let user = await User.login(username, password);
  //   if (user) {
  //     let token = user.generateToken();
  //     res.json({
  //       success: true,
  //       data: {
  //         token
  //       }
  //     });
  //   } else {
  //     throw new HttpException(UNAUTHORIZED, `登录失败`);
  //   }
  // } catch (error) {
  //   next(error);
  // }
}

/**
 * 上传头像
 */
export const uploadAvatar = () => {

}

