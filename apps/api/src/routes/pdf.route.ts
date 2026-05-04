import { Router } from "express";
import multer from "multer";
import { env } from "../config/env";
import {
  mergePdfsController,
  pdfMetadataController,
  rotatePagesController,
  protectPdfController,
  watermarkPdfController,
} from "../controllers/pdf.controller";

import { pdfToTextController, pdfToWordController } from "../controllers/pdf.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are accepted."));
    }
    cb(null, true);
  },
});

router.post("/to-text", upload.single("file"), pdfToTextController);
router.post("/to-word", upload.single("file"), pdfToWordController);

router.post("/merge",        upload.array("files", 10), mergePdfsController);
router.post("/metadata",     upload.single("file"),     pdfMetadataController);
router.post("/rotate-pages", upload.single("file"),     rotatePagesController);
router.post("/protect",      upload.single("file"),     protectPdfController);
router.post("/watermark",    upload.single("file"),     watermarkPdfController);

export default router;