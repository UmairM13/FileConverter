import { useEffect, useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import { useDownload } from "../../hooks/useDownload";
import { pdfToWord } from "../../services/pdfApi";
import { pageWrap } from "../../lib/styles";

export default function PdfToWord() {
  useEffect(() => { document.title = "Convert PDF to Word Free Online — FileKit"; }, []);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a PDF."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await pdfToWord(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader
        icon="📝"
        title="PDF to Word"
        description="Convert a PDF to a Word (.docx) document. Text content is extracted and preserved — note that original formatting, images, and complex layouts are not retained."
      />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="application/pdf" />
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Convert to Word" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}