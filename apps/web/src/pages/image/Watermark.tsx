import { useEffect, useState } from "react";
import DropZone from "../../components/DropZone";
import PageHeader from "../../components/ui/PageHeader";
import SubmitButton from "../../components/ui/SubmitButton";
import DownloadCard from "../../components/ui/DownloadCard";
import ErrorCard from "../../components/ui/ErrorCard";
import FormField from "../../components/ui/FormField";
import { useDownload } from "../../hooks/useDownload";
import { watermarkImage, type WatermarkOpts } from "../../services/imageApi";
import { pageWrap, fieldStack, inputStyle } from "../../lib/styles";

const positions = ["center", "top-left", "top-right", "bottom-left", "bottom-right"] as const;
const positionLabels: Record<string, string> = {
  "center": "Center", "top-left": "Top Left", "top-right": "Top Right",
  "bottom-left": "Bottom Left", "bottom-right": "Bottom Right",
};

export default function Watermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [position, setPosition] = useState<WatermarkOpts["position"]>("center");
  const [opacity, setOpacity] = useState(0.4);
  const [fontSize, setFontSize] = useState(48);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, filename, setResult } = useDownload();

  const handleSubmit = async () => {
    if (!file) { setError("Please upload an image."); return; }
    if (!text.trim()) { setError("Please enter watermark text."); return; }
    setLoading(true); setError(null);
    try {
      setResult(await watermarkImage(file, { text, position, opacity, fontSize }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="🔏" title="Watermark Image" description="Add a custom text watermark to your images." />
      <DropZone files={file ? [file] : []} onFiles={f => setFile(f[0])} accept="image/*" />
      <div style={fieldStack}>
        <FormField label="Watermark Text">
          <input type="text" placeholder="© Your Name" value={text}
            onChange={e => setText(e.target.value)} style={inputStyle} />
        </FormField>
        <FormField label="Position">
          <select value={position} onChange={e => setPosition(e.target.value as WatermarkOpts["position"])} style={inputStyle}>
            {positions.map(p => <option key={p} value={p}>{positionLabels[p]}</option>)}
          </select>
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
      <SubmitButton loading={loading} disabled={!file} onClick={handleSubmit} label="Add Watermark" />
      {error && <ErrorCard message={error} />}
      {url && <DownloadCard url={url} filename={filename} />}
    </div>
  );
}

useEffect(() => {
  document.title = "Watermark Image Free Online - FileKit"; 
} , []);