import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import ErrorCard from "../../components/ui/ErrorCard";
import { imageInfo, type ImageInfo as ImageInfoType } from "../../services/imageApi";
import { pageWrap } from "../../lib/styles";

const formatBytes = (b: number) => b > 1_000_000 ? `${(b / 1_000_000).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

const rows: { key: keyof ImageInfoType; label: string; format?: (v: unknown) => string }[] = [
  { key: "format",      label: "Format",      format: v => String(v).toUpperCase() },
  { key: "width",       label: "Width",       format: v => `${v}px` },
  { key: "height",      label: "Height",      format: v => `${v}px` },
  { key: "sizeBytes",   label: "File Size",   format: v => formatBytes(v as number) },
  { key: "space",       label: "Colour Space" },
  { key: "hasAlpha",    label: "Alpha Channel", format: v => v ? "Yes" : "No" },
  { key: "orientation", label: "Orientation", format: v => v === null ? "—" : String(v) },
];

export default function Info() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<ImageInfoType | null>(null);

  const handleSubmit = async () => {
    if (!file) { setError("Please upload an image."); return; }
    setLoading(true); setError(null);
    try {
      setInfo(await imageInfo(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="ℹ️" title="Image Info" description="View detailed metadata: dimensions, format, colour space, and more." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="image/*" />
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Inspect Image" />
      {error && <ErrorCard message={error} />}
      {info && (
        <div style={{ marginTop: "1rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", fontSize: "0.8rem", fontWeight: 600 }}>
            <CheckCircle2 size={14} /> Image Details
          </div>
          {rows.map(({ key, label, format }) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--muted)" }}>{label}</span>
              <span style={{ color: "var(--text)", fontWeight: 500 }}>
                {format ? format(info[key]) : (info[key] === null ? "—" : String(info[key]))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}