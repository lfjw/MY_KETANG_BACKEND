import mongoose, { Schema, Model, Document, HookNextFunction } from 'mongoose';
import validator from 'validator'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserPayload } from 'src/typings/payload';
export interface UserDocument extends Document {
  username: string;
  password: string;
  avatar: string;
  email: string;
  getAccessToke: () => string;
  _doc: UserDocument
}

const UserSchema: Schema<UserDocument> = new Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    minlength: [6, '最小长度不能小于6位'],
    maxlength: [12, '最大长度不得大于12位']
  },
  password: String,
  avatar: String,
  email: {
    type: String,
    validate: { // 自定义校验器  
      validator: validator.isEmail,
    },
    trim: true, // email='   @qq.com' 存的时候，是否要去空格
  }
},
  {
    timestamps: true, // 使用时间戳 会自动添加两个字段   createAt updateAt
    toJSON: {
      // 结果格式化
      transform: function (_doc: any, result: any) {
        result.id = result._id;
        delete result._id;
        delete result.__v;
        delete result.password
        delete result.createdAt
        delete result.updatedAt
        return result
      }
    }
  })

// 每次保存文档之前，执行什么操作
// 钩子函数
UserSchema.pre<UserDocument>('save', async function (next: HookNextFunction) {

  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await bcryptjs.hash(this.password, 10)
    // 不失败就查询库
    next()
  } catch (error) {
    // 失败报错
    next(error)
  }
})


// 扩展一个方法，在登录的时候进行用户名和密码的校验
// 返回一个promise 里面值为UserDocument或者的null
// 因为是模型上的方法，需要UserModel单独定义，根实例的方法有区别
UserSchema.static('login', async function (this: any, username: string, password: string): Promise<UserDocument | null> {
  let user: UserDocument | null = await this.model("User").findOne({ username })
  if (user) {
    // 判断用户输入的密码和数据库里存的密码是否匹配
    const matched = await bcryptjs.compare(password, user.password)
    if (matched) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }

})

// 给User模型的实例扩展一个方法
// 因为是 实例， 所以 在接口类型 UserDocument  加上getAccessToke 就不报错了
UserSchema.methods.getAccessToke = function (this: UserDocument): string {
  // this._id == this.id
  // this.id 是语法糖，指向this._id,仅限于模型上
  let payload: UserPayload = { id: this._id } // payload是放在jwt token里存放的数据
  // 1小时过期 1h 5s
  return jwt.sign(payload, process.env.JWT_SECRET_KEY || 'jw', { expiresIn: '1h' })
}


// 为了给l使ts不报错，为了login扩展此接口
interface UserModel<T extends Document> extends Model<T> {
  login: (username: string, password: string) => UserDocument | null;
}

export const User: UserModel<UserDocument> = mongoose.model<UserDocument, UserModel<UserDocument>>("User", UserSchema)

