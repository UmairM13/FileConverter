export type FieldConfig =
  | { type: "text";   name: string; label: string; placeholder?: string; required?: boolean }
  | { type: "number"; name: string; label: string; min?: number; max?: number; defaultValue?: number }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[] }
  | { type: "range";  name: string; label: string; min: number; max: number; step?: number; defaultValue?: number };

export type ToolConfig = {
  id: string;
  title: string;
  description: string;
  endpoint: string;
  accept: string;
  multiple?: boolean;
  fields?: FieldConfig[];
  responseType?: "file" | "json";
  icon: string;
};

export const IMAGE_TOOLS: ToolConfig[] = [
  {
    id: "convert",
    title: "Convert Image",
    description: "Convert images between JPEG, PNG, WebP, and AVIF formats.",
    endpoint: "/image/convert",
    accept: "image/*",
    icon: "🔄",
    fields: [
      { type: "select", name: "to", label: "Output Format", options: [
        { value: "webp",  label: "WebP"  },
        { value: "jpeg",  label: "JPEG"  },
        { value: "png",   label: "PNG"   },
        { value: "avif",  label: "AVIF"  },
      ]},
      { type: "range", name: "quality", label: "Quality", min: 1, max: 100, defaultValue: 82 },
    ],
  },
  {
    id: "resize",
    title: "Resize Image",
    description: "Resize images to specific dimensions while preserving quality.",
    endpoint: "/image/resize",
    accept: "image/*",
    icon: "↔️",
    fields: [
      { type: "number", name: "width",  label: "Width (px)",  min: 1, max: 10000 },
      { type: "number", name: "height", label: "Height (px)", min: 1, max: 10000 },
      { type: "select", name: "fit", label: "Fit Mode", options: [
        { value: "cover",   label: "Cover"   },
        { value: "contain", label: "Contain" },
        { value: "inside",  label: "Inside"  },
        { value: "outside", label: "Outside" },
        { value: "fill",    label: "Fill"    },
      ]},
    ],
  },
  {
    id: "compress",
    title: "Compress Image",
    description: "Reduce image file size without visible quality loss.",
    endpoint: "/image/compress",
    accept: "image/*",
    icon: "📦",
    fields: [
      { type: "range", name: "quality", label: "Quality", min: 1, max: 100, defaultValue: 82 },
    ],
  },
  {
    id: "grayscale",
    title: "Grayscale",
    description: "Convert any image to black and white instantly.",
    endpoint: "/image/grayscale",
    accept: "image/*",
    icon: "⬛",
  },
  {
    id: "watermark",
    title: "Watermark Image",
    description: "Add a custom text watermark to your images.",
    endpoint: "/image/watermark",
    accept: "image/*",
    icon: "🔏",
    fields: [
      { type: "text",   name: "text",     label: "Watermark Text", placeholder: "© Your Name", required: true },
      { type: "select", name: "position", label: "Position", options: [
        { value: "center",       label: "Center"       },
        { value: "top-left",     label: "Top Left"     },
        { value: "top-right",    label: "Top Right"    },
        { value: "bottom-left",  label: "Bottom Left"  },
        { value: "bottom-right", label: "Bottom Right" },
      ]},
      { type: "range",  name: "opacity",  label: "Opacity",   min: 0, max: 1, step: 0.05, defaultValue: 0.4 },
      { type: "range",  name: "fontSize", label: "Font Size", min: 8, max: 200, defaultValue: 48 },
    ],
  },
  {
    id: "strip-metadata",
    title: "Strip Metadata",
    description: "Remove EXIF data and metadata from images for privacy.",
    endpoint: "/image/strip-metadata",
    accept: "image/*",
    icon: "🧹",
  },
  {
    id: "to-pdf",
    title: "Images to PDF",
    description: "Combine multiple images into a single PDF document.",
    endpoint: "/image/to-pdf",
    accept: "image/*",
    multiple: true,
    icon: "📄",
  },
  {
    id: "info",
    title: "Image Info",
    description: "View detailed metadata: dimensions, format, colour space, and more.",
    endpoint: "/image/info",
    accept: "image/*",
    icon: "ℹ️",
    responseType: "json",
  },
];

export const PDF_TOOLS: ToolConfig[] = [
  {
    id: "merge",
    title: "Merge PDFs",
    description: "Combine multiple PDF files into one document.",
    endpoint: "/pdf/merge",
    accept: "application/pdf",
    multiple: true,
    icon: "🔗",
  },
  {
    id: "metadata",
    title: "PDF Metadata",
    description: "View title, author, page count, and creation date of a PDF.",
    endpoint: "/pdf/metadata",
    accept: "application/pdf",
    icon: "📋",
    responseType: "json",
  },
  {
    id: "rotate-pages",
    title: "Rotate Pages",
    description: "Rotate specific pages or the entire PDF by 90, 180, or 270 degrees.",
    endpoint: "/pdf/rotate-pages",
    accept: "application/pdf",
    icon: "🔃",
    fields: [
      { type: "select", name: "degrees", label: "Rotation", options: [
        { value: "90",  label: "90°  Clockwise"         },
        { value: "180", label: "180° Flip"              },
        { value: "270", label: "270° Counter-clockwise" },
      ]},
      { type: "text", name: "pages", label: "Pages (optional)", placeholder: "e.g. 1,3,5 — leave blank for all" },
    ],
  },
  {
    id: "protect",
    title: "Protect PDF",
    description: "Password-protect a PDF to restrict unauthorised access.",
    endpoint: "/pdf/protect",
    accept: "application/pdf",
    icon: "🔒",
    fields: [
      { type: "text", name: "userPassword",  label: "Password",        placeholder: "Required", required: true },
      { type: "text", name: "ownerPassword", label: "Owner Password",  placeholder: "Optional — defaults to password" },
    ],
  },
  {
    id: "watermark",
    title: "Watermark PDF",
    description: "Add a diagonal text watermark across every page of a PDF.",
    endpoint: "/pdf/watermark",
    accept: "application/pdf",
    icon: "🔏",
    fields: [
      { type: "text",  name: "text",     label: "Watermark Text", placeholder: "CONFIDENTIAL", required: true },
      { type: "range", name: "opacity",  label: "Opacity",    min: 0, max: 1,   step: 0.05, defaultValue: 0.3 },
      { type: "range", name: "fontSize", label: "Font Size",  min: 8, max: 200, defaultValue: 48 },
    ],
  },
];