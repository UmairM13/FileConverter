import sharp from "sharp";

type OutputFormat = "jpeg" | "png" | "webp" | "avif";
type Fit = "cover" | "contain" | "inside" | "outside" | "fill";

export async function convertImageService(
  input: Buffer,
  opts: {
    to: OutputFormat;
    quality?: number;     // 1..100
    width?: number;       // px
    height?: number;      // px
    fit?: Fit;            // sharp resize fit
  }
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  const { to, quality, width, height, fit = "cover" } = opts;

  // Validate the input is a readable image
  const meta = await sharp(input).metadata();
  if (!meta.format) {
    throw Object.assign(new Error("Unsupported or unreadable image"), { status: 400 });
  }

  // Start pipeline with auto-orientation (EXIF)
  let pipeline = sharp(input, {
    // safety cap: ~268MP (sharp default). Keep default unless you plan large images.
    limitInputPixels: 268402689,
  }).rotate();

  // Optional resize
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit,
      withoutEnlargement: true, // avoid upscaling
    });
  }

  // Output format + mime
  let mime = "application/octet-stream";
  let ext: string = to;

  switch (to) {
    case "jpeg":
      mime = "image/jpeg";
      ext = "jpg";
      pipeline = pipeline.jpeg({
        quality: quality ?? 82,
        mozjpeg: true,
        chromaSubsampling: "4:2:0",
      });
      break;
    case "png":
      mime = "image/png";
      ext = "png";
      pipeline = pipeline.png({
        quality: quality ?? 82,        // affects palette compression
        compressionLevel: 9,
        adaptiveFiltering: true,
      });
      break;
    case "webp":
      mime = "image/webp";
      ext = "webp";
      pipeline = pipeline.webp({
        quality: quality ?? 82,
        effort: 4,
      });
      break;
    case "avif":
      mime = "image/avif";
      ext = "avif";
      pipeline = pipeline.avif({
        quality: quality ?? 50,        // AVIF's scale is different; 45–60 is often good
        effort: 4,
      });
      break;
  }

  const buffer = await pipeline.toBuffer();
  return { buffer, mime, ext };
}
