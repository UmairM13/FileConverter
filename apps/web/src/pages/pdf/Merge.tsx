import { useEffect, useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import { useDownload } from "../../hooks/useDownload";
import { mergePdfs } from "../../services/pdfApi";
import { pageWrap } from "../../lib/styles";

export default function Merge() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  useEffect(() => {
    document.title = "Merge PDFs Free Online - FileKit";
  }, []);

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      setResult(await mergePdfs(files));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="🔗" title="Merge PDFs" description="Combine multiple PDF files into one document. Files are merged in upload order." />
      <DropZone files={files} onFiles={setFiles} accept="application/pdf" multiple />
      <SubmitButton loading={loading} disabled={files.length < 2} onClick={handleSubmit} label="Merge PDFs" />
      {files.length === 1 && <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "8px" }}>Upload at least one more PDF.</p>}
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}
