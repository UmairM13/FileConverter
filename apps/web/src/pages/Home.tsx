import { useEffect } from "react";
import { Link } from "react-router-dom";

type Tool = { icon: string; title: string; description: string; path: string };

const IMAGE_TOOLS: Tool[] = [
  { icon: "🔄", title: "Convert Image",   path: "/image/convert",        description: "Convert between JPEG, PNG, WebP, and AVIF." },
  { icon: "↔️", title: "Resize Image",    path: "/image/resize",         description: "Resize to exact dimensions while preserving quality." },
  { icon: "📦", title: "Compress Image",  path: "/image/compress",       description: "Reduce file size without visible quality loss." },
  { icon: "⬛", title: "Grayscale",       path: "/image/grayscale",      description: "Convert any image to black and white instantly." },
  { icon: "🔏", title: "Watermark Image", path: "/image/watermark",      description: "Add a custom text watermark to your images." },
  { icon: "🧹", title: "Strip Metadata",  path: "/image/strip-metadata", description: "Remove EXIF data from images for privacy." },
  { icon: "📄", title: "Images to PDF",   path: "/image/to-pdf",         description: "Combine multiple images into a single PDF." },
  { icon: "ℹ️", title: "Image Info",      path: "/image/info",           description: "View dimensions, format, colour space, and more." },
];

const PDF_TOOLS: Tool[] = [
  { icon: "🔗", title: "Merge PDFs",      path: "/pdf/merge",         description: "Combine multiple PDF files into one document." },
  { icon: "📋", title: "PDF Metadata",    path: "/pdf/metadata",      description: "View title, author, page count, and creation date." },
  { icon: "🔃", title: "Rotate Pages",    path: "/pdf/rotate-pages",  description: "Rotate specific pages or the entire PDF." },
  { icon: "🔒", title: "Protect PDF",     path: "/pdf/protect",       description: "Password-protect a PDF to restrict access." },
  { icon: "🔏", title: "Watermark PDF",   path: "/pdf/watermark",     description: "Add a water mark on PDF free. Add a diagonal text watermark across every page." },
  { icon: "📝", title: "PDF to Text",     path: "/pdf/to-text",         description: "Extract all text content from a PDF." },
  { icon: "📝", title: "PDF to Word", path: "/pdf/to-word", description: "Extract PDF text into a Word document." },
];

const DATA_TOOLS: Tool[] = [
  { icon: "🧹", title: "JSON Formatter",  path: "/data/json-formatter", description: "Prettify and format JSON instantly." },
  { icon: "⇄",  title: "JSON to CSV",     path: "/data/json-to-csv",    description: "Convert JSON arrays to CSV format." },
  { icon: "⇄",  title: "CSV to JSON",     path: "/data/csv-to-json",    description: "Convert CSV files to JSON format." },
  { icon: "⇄",  title: "JSON to XML",     path: "/data/json-to-xml",    description: "Convert JSON to XML format." },
  { icon: "⇄",  title: "XML to JSON",     path: "/data/xml-to-json",    description: "Convert XML to JSON format." },
  
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link to={tool.path} style={{ textDecoration: "none" }}>
      <div
        style={{
          padding: "1.25rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          height: "100%",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--accent)";
          el.style.transform = "translateY(-2px)";
          el.style.boxShadow = "0 8px 24px rgba(74,222,128,0.08)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--border)";
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "none";
        }}
      >
        <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>{tool.icon}</div>
        <h3 className="syne" style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
          {tool.title}
        </h3>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>
          {tool.description}
        </p>
      </div>
    </Link>
  );
}

function Section({ title, tools }: { title: string; tools: Tool[] }) {
  return (
    <section style={{ marginBottom: "3.5rem" }}>
      <h2 className="syne" style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {title}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
        {tools.map(t => <ToolCard key={t.path} tool={t} />)}
      </div>
    </section>
  );
}

export default function Home() {

  useEffect(() => {
    document.title = "FileKit - Free Online File Tools";
  })
  return (
    <div>
      <div style={{
        padding: "5rem 2rem 4rem",
        textAlign: "center",
        background: `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(74,222,128,0.07) 0%, transparent 70%)`,
        borderBottom: "1px solid var(--border)",
        marginBottom: "3rem",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          background: "rgba(74,222,128,0.1)",
          border: "1px solid rgba(74,222,128,0.2)",
          borderRadius: "100px",
          fontSize: "0.75rem",
          color: "var(--accent)",
          fontWeight: 500,
          marginBottom: "1.25rem",
          letterSpacing: "0.05em",
        }}>
          Free · No account needed · Files never stored
        </div>
        <h1 className="syne" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, margin: "0 0 1rem", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
          File <span style={{ color: "var(--accent)" }}>Tools.</span>
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
          Convert, compress, watermark, and transform images and PDFs.
        </p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <Section title="Image Tools" tools={IMAGE_TOOLS} />
        <Section title="PDF Tools"   tools={PDF_TOOLS}   />
        <Section title="Data & Code Tools" tools={DATA_TOOLS} />
      </div>
    </div>
  );
}
