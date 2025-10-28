import { Router } from "express";
import multer from "multer";
import { env } from "../config/env";
import { convertImageController } from "../controllers/image.controller";

const router = Router();

// Multer config — keep files in memory for now (small files)
// We can switch to disk storage at env.TMP_DIR later.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 }
});

router.post("/convert", upload.single("file"), convertImageController);

export default router;
