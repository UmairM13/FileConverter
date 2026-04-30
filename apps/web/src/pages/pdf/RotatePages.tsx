import { useEffect, useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import FormField from "../../components/ui/FormField";
import { useDownload } from "../../hooks/useDownload";
import { rotatePdfPages } from "../../services/pdfApi";
import { pageWrap, fieldStack, inputStyle } from "../../lib/styles";

const degrees = [90, 180, 270] as const;

export default function RotatePages() {
  const [file, setFile] = useState<File | null>(null);
  const [deg, setDeg] = useState<90 | 180 | 270>(90);
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a PDF."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await rotatePdfPages(file, { degrees: deg, pages: pages || undefined }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="🔃" title="Rotate Pages" description="Rotate specific pages or the entire PDF by 90, 180, or 270 degrees." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="application/pdf" />
      <div style={fieldStack}>
        <FormField label="Rotation">
          <select value={deg} onChange={e => setDeg(Number(e.target.value) as 90 | 180 | 270)} style={inputStyle}>
            {degrees.map(d => <option key={d} value={d}>{d}° {d === 90 ? "Clockwise" : d === 180 ? "Flip" : "Counter-clockwise"}</option>)}
          </select>
        </FormField>
        <FormField label="Pages (optional)">
          <input type="text" placeholder="e.g. 1,3,5 — leave blank for all pages"
            value={pages} onChange={e => setPages(e.target.value)} style={inputStyle} />
        </FormField>
      </div>
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Rotate Pages" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}

useEffect(() => {
  document.title = "Rotate PDFs pages Free Online - FileKit";
}, []);