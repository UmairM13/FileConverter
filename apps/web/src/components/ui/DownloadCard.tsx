import { Download } from "lucide-react";

type Props = { url: string; filename: string };

export default function DownloadCard({ url, filename }: Props) {
    return (
        <a
            href={url}
            download={filename}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "1rem",
                padding: "12px",
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.25)",
                borderRadius: "10px",
                color: "var(--accent)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "background 0.15s",
            }}
        >
            <Download size={18} /> Download {filename}
        </a>
    );
}