import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import ErrorCard from "../../components/ui/ErrorCard";
import { extractPdfText } from "../../services/pdfApi";
import { pageWrap } from "../../lib/styles";

export default function PdfToText() {
  useEffect(() => { document.title = "Extract Text from PDF Free Online — FileKit"; }, []);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a PDF."); return; }
    setLoading(true); setError(null);
    try {
      const result = await extractPdfText(file);
      setText(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "extracted.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="📝" title="PDF to Text" description="Extract all text content from a PDF file instantly." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="application/pdf" />
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Extract Text" />
      {error && <ErrorCard message={error} />}
      {text && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
              Extracted Text
            </span>
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
                Download .txt
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={text}
            style={{ width: "100%", minHeight: "300px", padding: "12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--accent)", fontSize: "0.85rem", fontFamily: "monospace", resize: "vertical", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      )}
    </div>
  );
}