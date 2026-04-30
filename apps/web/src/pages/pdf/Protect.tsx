import { useEffect, useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import FormField from "../../components/ui/FormField";
import { useDownload } from "../../hooks/useDownload";
import { protectPdf } from "../../services/pdfApi";
import { pageWrap, fieldStack, inputStyle } from "../../lib/styles";

export default function Protect() {
  const [file, setFile] = useState<File | null>(null);
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a PDF."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await protectPdf(file, {
        userPassword,
        ownerPassword: ownerPassword || undefined,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="🔒" title="Protect PDF" description="Password-protect a PDF to restrict unauthorised access." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="application/pdf" />
      <div style={fieldStack}>
        <FormField label="Password">
          <input type="password" placeholder="Required" value={userPassword}
            onChange={e => setUserPassword(e.target.value)} style={inputStyle} />
        </FormField>
        <FormField label="Owner Password (optional)">
          <input type="password" placeholder="Defaults to password above" value={ownerPassword}
            onChange={e => setOwnerPassword(e.target.value)} style={inputStyle} />
        </FormField>
      </div>
      <SubmitButton loading={loading} disabled={!file || !userPassword} onClick={handleSubmit} label="Protect PDF" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}

useEffect(() => {
  document.title = "Protect PDF free online - FileKit";
}, []);