import { useState, useRef } from "react";
import { Copy, Check, Upload } from "lucide-react";
import ErrorCard from "./ui/ErrorCard";

type Props = {
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  accept?: string;
  onConvert: (input: string) => string | Promise<string>;
  convertLabel: string;
  downloadExt: string;
};

export default function TextTool({
  inputLabel,
  outputLabel,
  inputPlaceholder,
  accept,
  onConvert,
  convertLabel,
  downloadExt,
}: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(reader.result as string);
    reader.readAsText(file);
  };

  const handleConvert = async () => {
    if (!input.trim()) { setError("Please enter or upload some content."); return; }
    setLoading(true); setError(null);
    try {
      const result = await onConvert(input);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setOutput("");
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.${downloadExt}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const areaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "220px",
    padding: "12px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text)",
    fontSize: "0.85rem",
    fontFamily: "monospace",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    color: "var(--muted)",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Input */}
      <div>
        <div style={labelStyle}>
          <span>{inputLabel}</span>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ background: "none", border: "1px solid var(--border)", borderRadius: "6px", padding: "3px 10px", color: "var(--muted)", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}
          >
            <Upload size={12} /> Upload file
          </button>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={inputPlaceholder}
          style={areaStyle}
        />
        <input ref={fileRef} type="file" accept={accept} onChange={handleFile} style={{ display: "none" }} />
      </div>

      {/* Convert button */}
      <button
        onClick={handleConvert}
        disabled={loading || !input.trim()}
        style={{
          padding: "11px",
          background: loading || !input.trim() ? "var(--border)" : "var(--accent)",
          color: loading || !input.trim() ? "var(--muted)" : "#000",
          border: "none",
          borderRadius: "10px",
          fontWeight: 600,
          fontSize: "0.95rem",
          cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          transition: "all 0.15s",
          fontFamily: "inherit",
        }}
      >
        {loading ? "Converting..." : convertLabel}
      </button>

      {error && <ErrorCard message={error} />}

      {/* Output */}
      {output && (
        <div>
          <div style={labelStyle}>
            <span>{outputLabel}</span>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={handleCopy}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: "6px", padding: "3px 10px", color: copied ? "var(--accent)" : "var(--muted)", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}
              >
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
              <button
                onClick={handleDownload}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: "6px", padding: "3px 10px", color: "var(--muted)", cursor: "pointer", fontSize: "0.75rem" }}
              >
                Download
              </button>
            </div>
          </div>
          <textarea readOnly value={output} style={{ ...areaStyle, color: "var(--accent)" }} />
        </div>
      )}
    </div>
  );
}