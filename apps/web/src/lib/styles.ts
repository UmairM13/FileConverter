import type { CSSProperties } from "react";

export const pageWrap: CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "3rem 1.5rem",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  color: "var(--text)",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "inherit",
  appearance: "none",
};

export const labelStyle: CSSProperties = {
  fontSize: "0.8rem",
  color: "var(--muted)",
  display: "block",
  marginBottom: "6px",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export const fieldStack: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  margin: "1.5rem 0",
};