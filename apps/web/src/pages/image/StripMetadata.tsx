import { useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import { useDownload } from "../../hooks/useDownload";
import { stripMetadata } from "../../services/imageApi";
import { pageWrap } from "../../lib/styles";

export default function StripMetadata() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  const handleSubmit = async () => {
    if (!file) { setError("Please upload an image."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await stripMetadata(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="🧹" title="Strip Metadata" description="Remove EXIF data and metadata from images for privacy." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="image/*" />
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Strip Metadata" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}