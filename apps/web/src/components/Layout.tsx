import { Link, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "rgba(14,14,18,0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 100,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <Zap size={20} color="var(--accent)" fill="var(--accent)" />
          <span className="syne" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
            FileKit
          </span>
        </Link>
        {!isHome && (
          <Link to="/" style={{ fontSize: "0.85rem", color: "var(--muted)", textDecoration: "none" }}>
            ← All Tools
          </Link>
        )}
      </header>

      <main style={{ flex: 1 }}>
        {children}
      </main>

      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "1.5rem 2rem",
        textAlign: "center",
        fontSize: "0.8rem",
        color: "var(--muted)",
      }}>
        FileKit -  Free online file tools. No uploads stored. &nbsp;
        

        <Link to="/privacy" style={{ color: "var(--muted)", textDecoration: "underline" }}>
        Privacy Policy 
        </Link>
      </footer>
    </div>
  );
}