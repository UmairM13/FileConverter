export type FileResult = { blob: Blob; filename: string };
export type ImageInfo = {
  format: string;
  width: number;
  height: number;
  hasAlpha: boolean;
  orientation: number | null;
  space: string | null;
  sizeBytes: number;
};

async function postSingleFile(endpoint: string, fd: FormData): Promise<FileResult> {
  const res = await fetch(endpoint, { method: "POST", body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Request failed");
  }
  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition") ?? "";
  const filename = cd.match(/filename="?([^"]+)"?/)?.[1] ?? "download";
  return { blob, filename };
}

function appendFile(fd: FormData, file: File, field = "file") {
  fd.append(field, file);
}

function appendOpts(fd: FormData, opts: Record<string, string | number | undefined>) {
  Object.entries(opts).forEach(([k, v]) => {
    if (v !== undefined) fd.append(k, String(v));
  });
}



export type ConvertOpts = {
  to: "jpeg" | "png" | "webp" | "avif";
  quality?: number;
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "inside" | "outside" | "fill";
};

export async function convertImage(file: File, opts: ConvertOpts): Promise<FileResult> {
  const fd = new FormData();
  appendFile(fd, file);
  appendOpts(fd, opts);
  return postSingleFile("/api/image/convert", fd);
}



export type ResizeOpts = {
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "inside" | "outside" | "fill";
  to?: "jpeg" | "png" | "webp" | "avif";
  quality?: number;
};

export async function resizeImage(file: File, opts: ResizeOpts): Promise<FileResult> {
  if (!opts.width && !opts.height) throw new Error("Provide at least a width or height.");
  const fd = new FormData();
  appendFile(fd, file);
  appendOpts(fd, opts);
  return postSingleFile("/api/image/resize", fd);
}



export type CompressOpts = {
  to?: "jpeg" | "png" | "webp" | "avif";
  quality?: number;
  effort?: number;
};

export async function compressImage(file: File, opts: CompressOpts): Promise<FileResult> {
  const fd = new FormData();
  appendFile(fd, file);
  appendOpts(fd, opts);
  return postSingleFile("/api/image/compress", fd);
}



export async function grayscaleImage(file: File): Promise<FileResult> {
  const fd = new FormData();
  appendFile(fd, file);
  return postSingleFile("/api/image/grayscale", fd);
}



export type WatermarkOpts = {
  text: string;
  position?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  opacity?: number;
  fontSize?: number;
  color?: string;
};

export async function watermarkImage(file: File, opts: WatermarkOpts): Promise<FileResult> {
  const fd = new FormData();
  appendFile(fd, file);
  appendOpts(fd, opts);
  return postSingleFile("/api/image/watermark", fd);
}



export async function stripMetadata(file: File): Promise<FileResult> {
  const fd = new FormData();
  appendFile(fd, file);
  return postSingleFile("/api/image/strip-metadata", fd);
}



export async function imagesToPdf(files: File[]): Promise<FileResult> {
  if (files.length < 1) throw new Error("Upload at least one image.");
  const fd = new FormData();
  files.forEach(f => fd.append("files", f));
  return postSingleFile("/api/image/pdf", fd);
}



export async function imageInfo(file: File): Promise<ImageInfo> {
  const fd = new FormData();
  appendFile(fd, file);
  const res = await fetch("/api/image/info", { method: "POST", body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.json() as Promise<ImageInfo>;
}