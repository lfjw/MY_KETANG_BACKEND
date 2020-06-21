import { Request, Response, NextFunction } from 'express'
import { Slider, SliderDocument } from '../models';

export const list = async (_req: Request, res: Response, _next: NextFunction) => {
  let sliders: SliderDocument[] = await Slider.find();

  res.json({
    success:true,
    data: sliders
  })
}