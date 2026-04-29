
export type FileResult = { blob: Blob; filename: string };
export type PdfMetadata = {
  title: string | null;
  author: string | null;
  subject: string | null;
  creator: string | null;
  producer: string | null;
  keywords: string | null;
  creationDate: string | null;
  modificationDate: string | null;
  pageCount: number;
};

async function postFile(endpoint: string, fd: FormData): Promise<FileResult> {
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

function appendOpts(fd: FormData, opts: Record<string, string | number | undefined>) {
  Object.entries(opts).forEach(([k, v]) => {
    if (v !== undefined) fd.append(k, String(v));
  });
}

// Endpoints

export async function mergePdfs(files: File[]): Promise<FileResult> {
  if (files.length < 2) throw new Error("Upload at least 2 PDF files to merge.");
  const fd = new FormData();
  files.forEach(f => fd.append("files", f));
  return postFile("/api/pdf/merge", fd);
}



export async function getPdfMetadata(file: File): Promise<PdfMetadata> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/pdf/metadata", { method: "POST", body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.json() as Promise<PdfMetadata>;
}



export type RotatePagesOpts = {
  degrees: 90 | 180 | 270;
  pages?: string; // comma-separated 1-based e.g. "1,3,5" — omit for all
};

export async function rotatePdfPages(file: File, opts: RotatePagesOpts): Promise<FileResult> {
  const fd = new FormData();
  fd.append("file", file);
  appendOpts(fd, { degrees: opts.degrees });
  if (opts.pages?.trim()) fd.append("pages", opts.pages.trim());
  return postFile("/api/pdf/rotate-pages", fd);
}


export type ProtectOpts = {
  userPassword: string;
  ownerPassword?: string;
};

export async function protectPdf(file: File, opts: ProtectOpts): Promise<FileResult> {
  if (!opts.userPassword) throw new Error("A password is required.");
  const fd = new FormData();
  fd.append("file", file);
  appendOpts(fd, opts);
  return postFile("/api/pdf/protect", fd);
}



export type WatermarkPdfOpts = {
  text: string;
  opacity?: number;
  fontSize?: number;
};

export async function watermarkPdf(file: File, opts: WatermarkPdfOpts): Promise<FileResult> {
  if (!opts.text.trim()) throw new Error("Watermark text cannot be empty.");
  const fd = new FormData();
  fd.append("file", file);
  appendOpts(fd, opts);
  return postFile("/api/pdf/watermark", fd);
}