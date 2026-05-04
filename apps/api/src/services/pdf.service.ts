import * as pdfLib from "pdf-lib";
import qpdf from "node-qpdf2";
import fs from "fs/promises";
import os from "os";
import path from "path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { Document, Paragraph, TextRun, Packer } from "docx";

export async function mergePdfsService(inputs: Buffer[]): Promise<Buffer> {
  const mergedDoc = await pdfLib.PDFDocument.create();

  for (const input of inputs) {
    const doc = await pdfLib.PDFDocument.load(input);
    const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
    pages.forEach(page => mergedDoc.addPage(page));
  }

  const bytes = await mergedDoc.save();
  return Buffer.from(bytes);
}

export async function pdfMetadataService(input: Buffer): Promise<Record<string, unknown>> {
  const doc = await pdfLib.PDFDocument.load(input);
  return {
    title:            doc.getTitle()            ?? null,
    author:           doc.getAuthor()           ?? null,
    subject:          doc.getSubject()          ?? null,
    creator:          doc.getCreator()          ?? null,
    producer:         doc.getProducer()         ?? null,
    keywords:         doc.getKeywords()         ?? null,
    creationDate:     doc.getCreationDate()?.toISOString()     ?? null,
    modificationDate: doc.getModificationDate()?.toISOString() ?? null,
    pageCount:        doc.getPageCount(),
  };
}

export async function rotatePagesService(
  input: Buffer,
  opts: { pages?: number[]; degrees: 90 | 180 | 270 }
): Promise<Buffer> {
  const doc = await pdfLib.PDFDocument.load(input);

  // pages is 1-based from the caller, convert to 0-based; default = all pages
  const indices = opts.pages
    ? opts.pages.map(p => p - 1).filter(i => i >= 0 && i < doc.getPageCount())
    : doc.getPageIndices();

  for (const idx of indices) {
    const page = doc.getPage(idx);
    const current = page.getRotation().angle;
    page.setRotation(pdfLib.degrees((current + opts.degrees) % 360));
  }

  return Buffer.from(await doc.save());
}

export async function protectPdfService(
  input: Buffer,
  opts: { userPassword: string; ownerPassword?: string }
): Promise<Buffer> {
  const tmpDir = os.tmpdir();
  const inputPath  = path.join(tmpDir, `input-${Date.now()}.pdf`);
  const outputPath = path.join(tmpDir, `output-${Date.now()}.pdf`);

  try {
    await fs.writeFile(inputPath, input);

    await qpdf.encrypt({
  input: inputPath,
  output: outputPath,
  keyLength: 256,
  password: {
    user: opts.userPassword,
    owner: opts.ownerPassword ?? opts.userPassword,
  },
  restrictions: {
    print: "none",
    modify: "none",
    extract: "n",
    annotate: "n",
  },
} as any);

    return await fs.readFile(outputPath);
  } finally {
    await fs.unlink(inputPath).catch(() => {});
    await fs.unlink(outputPath).catch(() => {});
  }
}


export async function watermarkPdfService(
  input: Buffer,
  opts: { text: string; opacity?: number; fontSize?: number }
): Promise<Buffer> {
  const { text, opacity = 0.3, fontSize = 48 } = opts;
  const doc = await pdfLib.PDFDocument.load(input);
  const font = await doc.embedFont(pdfLib.StandardFonts.HelveticaBold);

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: pdfLib.rgb(0.7, 0.7, 0.7),
      opacity,
      rotate: pdfLib.degrees(-30),
    });
  }

  return Buffer.from(await doc.save());
}


export async function pdfToTextService(input: Buffer): Promise<{ text: string; pages: number }> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(input) });
  const pdf = await loadingTask.promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => "str" in item ? item.str : "")
      .join(" ");
    fullText += pageText + "\n";
  }

  return {
    text: fullText.trim(),
    pages: pdf.numPages,
  };
}


export async function pdfToWordService(input: Buffer): Promise<Buffer> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs" as any);
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(input) });
  const pdf = await loadingTask.promise;

  const allParagraphs: Paragraph[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });

    // Group items into lines by Y position
    const lines: { y: number; items: any[] }[] = [];
    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const y = Math.round(viewport.height - (item.transform?.[5] ?? 0));
      const existing = lines.find(l => Math.abs(l.y - y) < 3);
      if (existing) {
        existing.items.push(item);
      } else {
        lines.push({ y, items: [item] });
      }
    }

    // Sort lines top to bottom
    lines.sort((a, b) => a.y - b.y);

    // Detect average font size for heading detection
    const allSizes = lines.flatMap(l => l.items.map((it: any) => it.height ?? 12));
    const avgSize = allSizes.reduce((a, b) => a + b, 0) / (allSizes.length || 1);

    let prevY = -1;

    for (const line of lines) {
      // Add spacing between lines that are far apart
      if (prevY !== -1 && line.y - prevY > 20) {
        allParagraphs.push(new Paragraph({ children: [] }));
      }
      prevY = line.y;

      const lineSize = line.items[0]?.height ?? 12;
      const isHeading = lineSize > avgSize * 1.3;
      const isLarge = lineSize > avgSize * 1.6;

      const runs = line.items.map((item: any) => {
        const fontName: string = item.fontName ?? "";
        const isBold = /bold/i.test(fontName);
        const isItalic = /italic|oblique/i.test(fontName);

        return new TextRun({
          text: item.str,
          bold: isBold || isHeading,
          italics: isItalic,
          size: isLarge ? 36 : isHeading ? 28 : 24,
        });
      });

      allParagraphs.push(new Paragraph({
        children: runs,
        heading: isLarge
          ? "Heading1" as any
          : isHeading
          ? "Heading2" as any
          : undefined,
        spacing: { after: isHeading ? 240 : 120 },
        indent: {
          left: Math.round((line.items[0]?.transform?.[4] ?? 0) * 0.5),
        },
      }));
    }

    // Page break between pages
    if (i < pdf.numPages) {
      allParagraphs.push(new Paragraph({
        children: [new TextRun({ text: "", break: 1 })],
        pageBreakBefore: true,
      }));
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 24 },
        },
      },
    },
    sections: [{
      properties: {},
      children: allParagraphs.length
        ? allParagraphs
        : [new Paragraph({ children: [new TextRun("No text found in PDF.")] })],
    }],
  });

  return Packer.toBuffer(doc);
}