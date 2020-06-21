
/** 
 * 定义数据库的模型
*/

import mongoose, { Schema, Model, Document } from 'mongoose';

export interface LessonDocument extends Document {
  order:number;
  title: string; // 标题
  video: string; //视频地址
  poster: string; // 海报地址
  url: string; // url地址
  price: string;  // 价格
  category: any; // 分类
}

const LessonSchema: Schema<LessonDocument> = new Schema({
  order: Number,
  title: String, // 标题
  video: String, //视频地址
  poster: String, // 海报地址
  url: String, // url地址
  price: String,  // 价格
  category: String, // 分类
}, {
  timestamps: true, toJSON: {
    transform: function (_doc: LessonDocument, result: LessonDocument) {
      result.id = result._id;
      delete result.id;
      delete result.__v;
      return result;
    }
  }
})


export const Lesson: Model<LessonDocument> = mongoose.model('Lesson', LessonSchema)