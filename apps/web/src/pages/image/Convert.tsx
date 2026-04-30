import { useEffect, useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import FormField from "../../components/ui/FormField";
import { useDownload } from "../../hooks/useDownload";
import { convertImage, type ConvertOpts } from "../../services/imageApi";
import { pageWrap, fieldStack, inputStyle } from "../../lib/styles";

const formats = ["webp", "jpeg", "png", "avif"] as const;

export default function Convert() {
  const [file, setFile] = useState<File | null>(null);
  const [to, setTo] = useState<ConvertOpts["to"]>("webp");
  const [quality, setQuality] = useState(82);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  const handleSubmit = async () => {
    if (!file) { setError("Please upload an image."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await convertImage(file, { to, quality }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="🔄" title="Convert Image" description="Convert images between JPEG, PNG, WebP, and AVIF formats." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="image/*" />
      <div style={fieldStack}>
        <FormField label="Output Format">
          <select value={to} onChange={e => setTo(e.target.value as ConvertOpts["to"])} style={inputStyle}>
            {formats.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
          </select>
        </FormField>
        <FormField label={`Quality — ${quality}`}>
          <input type="range" min={1} max={100} value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent)" }} />
        </FormField>
      </div>
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Convert Image" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}

useEffect(() => {
  document.title = "Convert Image Free Online - FileKit";
}, []);