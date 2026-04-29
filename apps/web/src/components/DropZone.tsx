import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";

type Props = {
  multiple?: boolean;
  accept?: string;
  onFiles: (files: File[]) => void;
  files: File[];
};

export default function DropZone({ multiple, accept, onFiles, files }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    onFiles(multiple ? dropped : [dropped[0]]);
  }, [multiple, onFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFiles(Array.from(e.target.files));
  };

  const remove = (i: number) => onFiles(files.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "12px",
          padding: "3rem 2rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "rgba(74,222,128,0.04)" : "var(--surface)",
          transition: "all 0.2s ease",
        }}
      >
        <Upload size={28} color={dragging ? "var(--accent)" : "var(--muted)"} style={{ margin: "0 auto 12px" }} />
        <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text)", fontWeight: 500 }}>
          {files.length ? "Drop to replace" : "Drop files here"}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--muted)" }}>
          or click to browse
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              background: "var(--surface)",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "0.85rem",
            }}>
              <FileText size={15} color="var(--accent)" />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>
                {f.name}
              </span>
              <span style={{ color: "var(--muted)", flexShrink: 0 }}>
                {(f.size / 1024).toFixed(0)} KB
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "var(--muted)", display: "flex" }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}