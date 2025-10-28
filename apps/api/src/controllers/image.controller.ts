import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { convertImageService } from "../services/image.service";

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
