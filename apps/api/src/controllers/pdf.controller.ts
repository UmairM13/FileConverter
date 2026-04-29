import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  mergePdfsService,
  pdfMetadataService,
  rotatePagesService,
  protectPdfService,
  watermarkPdfService,
} from "../services/pdf.service";

export async function mergePdfsController(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length || files.length < 2)
      return res.status(400).json({ error: "Upload at least 2 PDF files." });

    const pdfBuffer = await mergePdfsService(files.map(f => f.buffer));
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="merged.pdf"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) { next(err); }
}

export async function pdfMetadataController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file?.buffer) return res.status(400).json({ error: "No file uploaded." });
    return res.status(200).json(await pdfMetadataService(req.file.buffer));
  } catch (err) { next(err); }
}

const rotatePagesSchema = z.object({
  degrees: z.coerce.number().refine(v => [90, 180, 270].includes(v), {
    message: "degrees must be 90, 180, or 270",
  }) as z.ZodType<90 | 180 | 270>,
  // Accept comma-separated 1-based page numbers e.g. "1,3,5" or omit for all
  pages: z.string().optional().transform(val =>
    val ? val.split(",").map(Number).filter(n => !isNaN(n) && n > 0) : undefined
  ),
});

export async function rotatePagesController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file?.buffer) return res.status(400).json({ error: "No file uploaded." });
    const { degrees, pages } = rotatePagesSchema.parse({ ...req.query, ...req.body });
    const pdfBuffer = await rotatePagesService(req.file.buffer, { degrees, pages });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="rotated.pdf"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) { next(err); }
}

const protectSchema = z.object({
  userPassword: z.string().min(1).max(100),
  ownerPassword: z.string().min(1).max(100).optional(),
});

export async function protectPdfController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file?.buffer) return res.status(400).json({ error: "No file uploaded." });
    const opts = protectSchema.parse(req.body);
    const pdfBuffer = await protectPdfService(req.file.buffer, opts);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="protected.pdf"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) { next(err); }
}

const watermarkPdfSchema = z.object({
  text: z.string().min(1).max(100),
  opacity: z.coerce.number().min(0).max(1).default(0.3),
  fontSize: z.coerce.number().int().min(8).max(200).default(48),
});

export async function watermarkPdfController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file?.buffer) return res.status(400).json({ error: "No file uploaded." });
    const opts = watermarkPdfSchema.parse({ ...req.query, ...req.body });
    const pdfBuffer = await watermarkPdfService(req.file.buffer, opts);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="watermarked.pdf"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) { next(err); }
}