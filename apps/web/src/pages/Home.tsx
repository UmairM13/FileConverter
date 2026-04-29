import { Link } from "react-router-dom";
import { IMAGE_TOOLS, PDF_TOOLS, type ToolConfig } from "../tools";

function ToolCard({ tool, category }: { tool: ToolConfig; category: string }) {
  return (
    <Link
      to={`/${category}/${tool.id}`}
      style={{ textDecoration: "none" }}
    >
      <div style={{
        padding: "1.25rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        height: "100%",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(74,222,128,0.08)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
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

function Section({ title, tools, category }: { title: string; tools: ToolConfig[]; category: string }) {
  return (
    <section style={{ marginBottom: "3.5rem" }}>
      <h2 className="syne" style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {title}
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "12px",
      }}>
        {tools.map(t => <ToolCard key={t.id} tool={t} category={category} />)}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
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
        <h1 className="syne" style={{
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 800,
          margin: "0 0 1rem",
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
        }}>
          File 
          <span style={{ color: "var(--accent)" }}> Tools.</span>
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
          Convert, compress, watermark, and transform images and PDFs.
        </p>
      </div>

      {/* Tools */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <Section title="Image Tools" tools={IMAGE_TOOLS} category="image" />
        <Section title="PDF Tools"   tools={PDF_TOOLS}   category="pdf"   />
      </div>
    </div>
  );
}