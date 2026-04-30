import { useEffect, useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import { useDownload } from "../../hooks/useDownload";
import { imagesToPdf } from "../../services/imageApi";
import { pageWrap } from "../../lib/styles";

export default function ToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  const handleSubmit = async () => {
    if (!files.length) { setError("Please upload at least one image."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await imagesToPdf(files));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="📄" title="Images to PDF" description="Combine multiple images into a single PDF. Each image becomes one page, in upload order." />
      <DropZone files={files} onFiles={setFiles} accept="image/*" multiple />
      <SubmitButton loading={loading} disabled={!files.length} onClick={handleSubmit} label="Create PDF" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}

useEffect(() => {
  document.title = "Convert Images to PDF Free Online - FileKit";
}, []); 
