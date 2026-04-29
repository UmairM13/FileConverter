import { Router } from "express";
import multer from "multer";
import { env } from "../config/env";
import { convertImageController, resizeImageController, compressImageController, imageInfoController,
  grayscaleImageController, stripMetadataController, watermarkImageController, imagesToPdfController
 } from "../controllers/image.controller";

const router = Router();

// Multer config — keep files in memory for now (small files)
// We can switch to disk storage at env.TMP_DIR later.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 }
});

router.post("/convert", upload.single("file"), convertImageController);
router.post("/resize", upload.single("file"), resizeImageController);
router.post("/compress", upload.single("file"), compressImageController);
router.post("/info", upload.single("file"), imageInfoController);
router.post("/grayscale", upload.single("file"), grayscaleImageController);
router.post("/strip-metadata", upload.single("file"), stripMetadataController);
router.post("/watermark", upload.single("file"), watermarkImageController);
router.post("/pdf", upload.array("files", 20), imagesToPdfController);

export default router;
