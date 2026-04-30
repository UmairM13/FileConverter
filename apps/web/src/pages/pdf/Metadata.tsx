import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import ErrorCard from "../../components/ui/ErrorCard";
import { getPdfMetadata, type PdfMetadata } from "../../services/pdfApi";
import { pageWrap } from "../../lib/styles";

const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-GB", { dateStyle: "medium" }) : "—";

const rows: { key: keyof PdfMetadata; label: string }[] = [
  { key: "pageCount",        label: "Pages"             },
  { key: "title",            label: "Title"             },
  { key: "author",           label: "Author"            },
  { key: "subject",          label: "Subject"           },
  { key: "creator",          label: "Creator"           },
  { key: "producer",         label: "Producer"          },
  { key: "keywords",         label: "Keywords"          },
  { key: "creationDate",     label: "Created"           },
  { key: "modificationDate", label: "Last Modified"     },
];

export default function Metadata() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PdfMetadata | null>(null);

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a PDF."); return; }
    setLoading(true); setError(null);
    try {
      setMeta(await getPdfMetadata(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  const displayValue = (key: keyof PdfMetadata, val: PdfMetadata[keyof PdfMetadata]) => {
    if (key === "creationDate" || key === "modificationDate") return formatDate(val as string | null);
    return val === null || val === "" ? "—" : String(val);
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="📋" title="PDF Metadata" description="View title, author, page count, and creation date of a PDF." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="application/pdf" />
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Inspect PDF" />
      {error && <ErrorCard message={error} />}
      {meta && (
        <div style={{ marginTop: "1rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", fontSize: "0.8rem", fontWeight: 600 }}>
            <CheckCircle2 size={14} /> PDF Details
          </div>
          {rows.map(({ key, label }) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--muted)" }}>{label}</span>
              <span style={{ color: "var(--text)", fontWeight: 500 }}>{displayValue(key, meta[key])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

useEffect(() => {
  document.title = "Get PDF Metadata Free Online - FileKit";
}, []);