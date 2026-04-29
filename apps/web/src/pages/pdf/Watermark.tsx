import { useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import FormField from "../../components/ui/FormField";
import { useDownload } from "../../hooks/useDownload";
import { watermarkPdf } from "../../services/pdfApi";
import { pageWrap, fieldStack, inputStyle } from "../../lib/styles";

export default function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(48);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a PDF."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await watermarkPdf(file, { text, opacity, fontSize }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="🔏" title="Watermark PDF" description="Add a diagonal text watermark across every page of a PDF." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="application/pdf" />
      <div style={fieldStack}>
        <FormField label="Watermark Text">
          <input type="text" placeholder="e.g. CONFIDENTIAL" value={text}
            onChange={e => setText(e.target.value)} style={inputStyle} />
        </FormField>
        <FormField label={`Opacity — ${opacity}`}>
          <input type="range" min={0} max={1} step={0.05} value={opacity}
            onChange={e => setOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent)" }} />
        </FormField>
        <FormField label={`Font Size — ${fontSize}px`}>
          <input type="range" min={8} max={200} value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent)" }} />
        </FormField>
      </div>
      <SubmitButton loading={loading} disabled={!file || !text.trim()} onClick={handleSubmit} label="Add Watermark" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}