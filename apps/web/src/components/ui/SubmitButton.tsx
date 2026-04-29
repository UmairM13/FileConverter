import { Loader2 } from "lucide-react";

type Props = { onClick: () => void; loading: boolean; disabled: boolean; label: string };

export default function SubmitButton({ onClick, loading, disabled, label }: Props) {
  const inactive = loading || disabled;
  return (
    <>
      <button
        onClick={onClick}
        disabled={inactive}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "1.5rem",
          background: inactive ? "var(--border)" : "var(--accent)",
          color: inactive ? "var(--muted)" : "#000",
          border: "none",
          borderRadius: "10px",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: inactive ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.15s",
          fontFamily: "inherit",
        }}
      >
        {loading
          ? <><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Processing...</>
          : label}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}