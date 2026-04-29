import { AlertCircle } from "lucide-react";

export default function ErrorCard({ message }: { message: string }) {
  return (
    <div style={{
      display: "flex",
      gap: "8px",
      alignItems: "center",
      padding: "12px",
      marginTop: "1rem",
      background: "rgba(239,68,68,0.08)",
      borderRadius: "8px",
      border: "1px solid rgba(239,68,68,0.2)",
      color: "#f87171",
      fontSize: "0.9rem",
    }}>
      <AlertCircle size={16} style={{ flexShrink: 0 }} /> {message}
    </div>
  );
}