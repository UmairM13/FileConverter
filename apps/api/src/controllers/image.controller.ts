import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { convertImageService, imageInfoService } from "../services/image.service";
import { resizeImageService } from "../services/image.service";
import { compressImageService } from "../services/image.service";


const querySchema = z.object({
  to: z.enum(["jpeg", "png", "webp", "avif"]).default("webp"),
  quality: z.coerce.number().int().min(1).max(100).optional(),
  width: z.coerce.number().int().positive().max(10000).optional(),
  height: z.coerce.number().int().positive().max(10000).optional(),
  fit: z.enum(["cover", "contain", "inside", "outside", "fill"]).default("cover").optional(),
});

export async function convertImageController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No file uploaded. Use form-data with field 'file'." });
    }

    const parsed = querySchema.parse({ ...req.query, ...req.body });
    const { to, quality, width, height, fit } = parsed;

    // Build opts without inserting undefined
    const opts: {
      to: "jpeg" | "png" | "webp" | "avif";
      quality?: number;
      width?: number;
      height?: number;
      fit?: "cover" | "contain" | "inside" | "outside" | "fill";
    } = { to, fit: fit ?? "cover" };

    if (quality !== undefined) opts.quality = quality;
    if (width !== undefined)   opts.width = width;
    if (height !== undefined)  opts.height = height;

    const { buffer, mime, ext } = await convertImageService(req.file.buffer, opts);

    const original = req.file.originalname || "image";
    const base = original.replace(/\.[^.]+$/, "");
    const filename = `${base}.${ext}`;

    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
}

const formatEnum = z.enum(["jpeg", "png", "webp", "avif"]);
const fitEnum = z.enum(["cover", "contain", "inside", "outside", "fill"]);

const resizeSchema = z.object({
  width: z.coerce.number().int().positive().max(10000).optional(),
  height: z.coerce.number().int().positive().max(10000).optional(),
  fit: fitEnum.default("cover").optional(),
  to: formatEnum.optional(),
  quality: z.coerce.number().int().min(1).max(100).optional(),
});


export async function resizeImageController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No file uploaded. Use form-data with field 'file'." });
    }

    const { width, height, fit, to, quality } = resizeSchema.parse({ ...req.query, ...req.body });
    const opts: Parameters<typeof resizeImageService>[1] = { fit: fit ?? "cover" };
    if (width !== undefined) opts.width = width;
    if (height !== undefined) opts.height = height;
    if (to !== undefined) opts.to = to;
    if (quality !== undefined) opts.quality = quality;


    const { buffer, mime, ext } = await resizeImageService(req.file.buffer, opts);
    const name = (req.file.originalname || "image").replace(/\.[^.]+$/, "");

    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Disposition", `attachment; filename="${name}_resized.${ext}"`);

    return res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
}


const compressSchema = z.object({
  to: formatEnum.optional(),
  quality: z.coerce.number().int().min(1).max(100).optional(),
  effort: z.coerce.number().int().min(0).max(9).optional(),
});

export async function compressImageController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file?.buffer) return res.status(400).json({ error: "No file uploaded. Use 'file'." });
    const { to, quality, effort } = compressSchema.parse({ ...req.query, ...req.body });

    const opts: Parameters<typeof compressImageService>[1] = {};
    if (to !== undefined) opts.to = to;
    if (quality !== undefined) opts.quality = quality;
    if (effort !== undefined) opts.effort = effort;

    const { buffer, mime, ext } = await compressImageService(req.file.buffer, opts);
    const name = (req.file.originalname || "image").replace(/\.[^.]+$/, "");
    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Disposition", `attachment; filename="${name}.${ext}"`);
    return res.status(200).send(buffer);
  } catch (err) { next(err); }
}

export async function imageInfoController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file?.buffer) return res.status(400).json({ error: "No file uploaded. Use 'file'." });
    const info = await imageInfoService(req.file.buffer, req.file.size);
    return res.status(200).json(info);
  } catch (err) { next(err); }
}
