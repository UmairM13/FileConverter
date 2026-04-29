import * as pdfLib from "pdf-lib";

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
  const doc = await pdfLib.PDFDocument.load(input);
  const bytes = await doc.save({
  userPassword: opts.userPassword,
  ownerPassword: opts.ownerPassword ?? opts.userPassword,
    } as pdfLib.SaveOptions);
  return Buffer.from(bytes);
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