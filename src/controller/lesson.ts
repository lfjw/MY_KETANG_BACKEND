import { Request, Response } from 'express'
import { Lesson, LessonDocument } from '../models';

export const list = async (req: Request, res: Response) => {
  let { category, offset, limit } = req.query

  // TODO offset 设置不成
  // isNaN(offset) ? 0 :  Number(offset)
  let newOffset: number = Number(offset)
  let newLimit: number = Number(limit)

  // Partial 内部的字段变成非必填项
  let query: Partial<LessonDocument> = {};
  if (category && category !== 'all') {
    query.category = category
  }

  let total: number = await Lesson.count(query) // 查询复合条件的总条数
  // 1 生序 -1 降序
  let lessons: LessonDocument[] = await Lesson.find(query).sort({ order: 1 }).skip(newOffset).limit(newLimit)
  res.json({
    success: true,
    data: {
      list: lessons,
      hasMore: total > newOffset + newLimit // 20> 0+ 5 / 20 > 5+ 5 / 
    }
  })
}