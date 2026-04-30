import { useEffect, useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import FormField from "../../components/ui/FormField";
import { useDownload } from "../../hooks/useDownload";
import { compressImage } from "../../services/imageApi";
import { pageWrap, fieldStack } from "../../lib/styles";

export default function Compress() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(82);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  useEffect(() => {
    document.title = "Compress Image Free Online - FileKit";
  }, []);

  const handleSubmit = async () => {
    if (!file) { setError("Please upload an image."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await compressImage(file, { quality }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="📦" title="Compress Image" description="Reduce image file size without visible quality loss." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="image/*" />
      <div style={fieldStack}>
        <FormField label={`Quality — ${quality}`}>
          <input type="range" min={1} max={100} value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent)" }} />
        </FormField>
      </div>
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Compress Image" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}
