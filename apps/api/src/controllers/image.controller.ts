import { Request, Response, NextFunction } from "express";
import { convertImageStub } from "../services/image.service";

export async function convertImage(req: Request, res: Response, next: NextFunction) {
  try {
    // file is available at req.file when we wire multer
    const result = await convertImageStub();
    res.json({ status: result });
  } catch (err) {
    next(err);
  }
}
