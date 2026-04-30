import { useEffect, useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import FormField from "../../components/ui/FormField";
import { useDownload } from "../../hooks/useDownload";
import { resizeImage, type ResizeOpts } from "../../services/imageApi";
import { pageWrap, fieldStack, inputStyle } from "../../lib/styles";

const fitOptions = ["cover", "contain", "inside", "outside", "fill"] as const;

export default function Resize() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [fit, setFit] = useState<ResizeOpts["fit"]>("cover");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  const handleSubmit = async () => {
    if (!file) { setError("Please upload an image."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await resizeImage(file, {
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
        fit,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="↔️" title="Resize Image" description="Resize images to specific dimensions while preserving quality." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="image/*" />
      <div style={fieldStack}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <FormField label="Width (px)">
            <input type="number" min={1} max={10000} placeholder="e.g. 1920"
              value={width} onChange={e => setWidth(e.target.value)} style={inputStyle} />
          </FormField>
          <FormField label="Height (px)">
            <input type="number" min={1} max={10000} placeholder="e.g. 1080"
              value={height} onChange={e => setHeight(e.target.value)} style={inputStyle} />
          </FormField>
        </div>
        <FormField label="Fit Mode">
          <select value={fit} onChange={e => setFit(e.target.value as ResizeOpts["fit"])} style={inputStyle}>
            {fitOptions.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
          </select>
        </FormField>
      </div>
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Resize Image" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}

useEffect(() => {
  document.title = "Resize Image Free Online - FileKit";
}, []);