import { useState } from "react";
import { Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import DropZone from "./DropZone";
import type { ToolConfig } from "../tools";

export default function ToolPage({ tool }: { tool: ToolConfig }) {
  const [files, setFiles] = useState<File[]>([]);
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    tool.fields?.forEach(f => {
      if (f.type === "range" || f.type === "number") {
        if ("defaultValue" in f && f.defaultValue !== undefined)
          defaults[f.name] = String(f.defaultValue);
      }
      if (f.type === "select") defaults[f.name] = f.options[0].value;
    });
    return defaults;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<Record<string, unknown> | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("download");

  const handleSubmit = async () => {
    if (!files.length) { setError("Please upload a file first."); return; }
    setLoading(true); setError(null); setJsonResult(null);
    if (downloadUrl) { URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); }

    try {
      const fd = new FormData();
      const fieldName = tool.multiple ? "files" : "file";
      files.forEach(f => fd.append(fieldName, f));
      Object.entries(fields).forEach(([k, v]) => { if (v) fd.append(k, v); });

      const res = await fetch(tool.endpoint, { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? "Request failed");
      }

      if (tool.responseType === "json") {
        setJsonResult(await res.json());
      } else {
        const blob = await res.blob();
        const cd = res.headers.get("Content-Disposition") ?? "";
        const match = cd.match(/filename="?([^"]+)"?/);
        setDownloadName(match?.[1] ?? "download");
        setDownloadUrl(URL.createObjectURL(blob));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    color: "var(--muted)",
    display: "block",
    marginBottom: "6px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text)",
    fontSize: "0.9rem",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{tool.icon}</div>
        <h1 className="syne" style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
          {tool.title}
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{tool.description}</p>
      </div>

      {/* Upload */}
      <div style={{ marginBottom: "1.5rem" }}>
        <DropZone
          multiple={tool.multiple}
          accept={tool.accept}
          files={files}
          onFiles={setFiles}
        />
      </div>

      {/* Fields */}
      {tool.fields && tool.fields.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "1.5rem" }}>
          {tool.fields.map(f => (
            <div key={f.name}>
              <label style={labelStyle}>{f.label}</label>
              {f.type === "select" && (
                <select
                  value={fields[f.name] ?? f.options[0].value}
                  onChange={e => setFields(p => ({ ...p, [f.name]: e.target.value }))}
                  style={inputStyle}
                >
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              )}
              {f.type === "text" && (
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={fields[f.name] ?? ""}
                  onChange={e => setFields(p => ({ ...p, [f.name]: e.target.value }))}
                  style={inputStyle}
                />
              )}
              {f.type === "number" && (
                <input
                  type="number"
                  min={f.min}
                  max={f.max}
                  value={fields[f.name] ?? ""}
                  onChange={e => setFields(p => ({ ...p, [f.name]: e.target.value }))}
                  style={inputStyle}
                />
              )}
              {f.type === "range" && (
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input
                    type="range"
                    min={f.min} max={f.max} step={f.step ?? 1}
                    value={fields[f.name] ?? f.defaultValue ?? f.min}
                    onChange={e => setFields(p => ({ ...p, [f.name]: e.target.value }))}
                    style={{ flex: 1, accentColor: "var(--accent)" }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "var(--text)", minWidth: "36px", textAlign: "right" }}>
                    {fields[f.name] ?? f.defaultValue ?? f.min}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !files.length}
        style={{
          width: "100%",
          padding: "12px",
          background: loading || !files.length ? "var(--border)" : "var(--accent)",
          color: loading || !files.length ? "var(--muted)" : "#000",
          border: "none",
          borderRadius: "10px",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: loading || !files.length ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.2s",
          marginBottom: "1rem",
        }}
      >
        {loading ? <><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Processing...</> : `Run — ${tool.title}`}
      </button>

      {/* Error */}
      {error && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", padding: "12px", background: "rgba(239,68,68,0.1)", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "0.9rem" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* JSON result */}
      {jsonResult && (
        <div style={{ marginTop: "1rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", fontSize: "0.8rem", fontWeight: 600 }}>
            <CheckCircle2 size={14} /> Result
          </div>
          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {Object.entries(jsonResult).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--muted)" }}>{k}</span>
                <span style={{ color: "var(--text)", fontWeight: 500 }}>{v === null ? "—" : String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download */}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download={downloadName}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "1rem",
            padding: "12px",
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.25)",
            borderRadius: "10px",
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          <Download size={17} /> Download {downloadName}
        </a>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}