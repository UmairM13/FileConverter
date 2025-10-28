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

function formatToMimeExt(fmt: OutputFormat | string | undefined): { mime: string; ext: string } {
  switch (fmt) {
    case "jpeg":
      return { mime: "image/jpeg", ext: "jpg" };
    case "png":
      return { mime: "image/png", ext: "png" };
    case "webp":
      return { mime: "image/webp", ext: "webp" };
    case "avif":
      return { mime: "image/avif", ext: "avif" };
    default:
      return { mime: "application/octet-stream", ext: "bin" };
  }
}


export async function resizeImageService(
  input: Buffer,
  opts: { width?: number; height?: number; fit?: Fit; to?: OutputFormat; quality?: number }
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  const meta = await sharp(input).metadata();
  const origFmt = (meta.format as OutputFormat | undefined) ?? "jpeg";
  const to = opts.to ?? origFmt;

  return convertImageService(input, {
    to, 
    width: opts.width,
    height: opts.height,
    fit: opts.fit,
    quality: opts.quality,
  });
}

export async function compressImageService(
  input: Buffer,
  opts: { to?: OutputFormat; quality?: number; effort?: number }
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  const meta = await sharp(input).metadata();
  const origFmt = (meta.format as OutputFormat | undefined) ?? "jpeg";
  const target = opts.to ?? origFmt;

  let pipeline = sharp(input).rotate();
  let {mime, ext} = formatToMimeExt(target);

  switch(target){
    case "jpeg":
      pipeline = pipeline.jpeg({
        quality: opts.quality ?? 82, mozjpeg: true, chromaSubsampling: "4:2:0"});
        break;
    case "png":
      pipeline = pipeline.png({
        compressionLevel: Math.max(0, Math.min(0, Math.min(9, opts.effort ?? 9))),
        quality: opts.quality ?? 82,
        adaptiveFiltering: true,
      });
      break;
    case "webp":
      pipeline = pipeline.webp({ quality: opts.quality ?? 82, effort: Math.max(0, Math.min(6, opts.effort ?? 4)) });
      break;
    case "avif":
      pipeline = pipeline.avif({ quality: opts.quality ?? 50, effort: Math.max(0, Math.min(8, opts.effort ?? 4)) });
      break;  
  }

  const buffer = await pipeline.toBuffer();
  return { buffer, mime, ext };
}


export async function imageInfoService(input: Buffer, uploadSize?: number){
  const meta = await sharp(input).metadata();
  return{
    format: meta.format,
    width: meta.width,
    height: meta.height,
    hasAlpha: meta.hasAlpha ?? false,
    orientation: meta.orientation ?? null,
    space: meta.space ?? null,
    sizeBytes: uploadSize ?? input.byteLength,
  };
}