import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../typings/jwt';

const item = {
  timestamps: true, toJSON: {
    transform: function (_doc: any, result: any) {
      result.id = result._id;
      delete result._id;
      delete result.__v;
      delete result.password;
      delete result.createdAt;
      delete result.updatedAt;
      return result;
    }
  }
}

const UserSchema = new Schema({
  // 用户名
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    minlength: [6, '最小长度不能少于6位'],
    maxlength: [12, '最大长度不能大于12位']
  },
  // 密码
  password: String,
  // 头像
  avatar: String,
  // 邮箱
  email: {
    type: String,
    validate: {
      validator: validator.isEmail
    },
    trim: true,
  }
}, item);



UserSchema.methods.generateToken = function (): string {
  let payload: UserPayload = ({ id: this.id });
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
}

export const User = mongoose.model('User', UserSchema);



