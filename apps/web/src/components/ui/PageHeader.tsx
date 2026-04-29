type Props = { icon: string; title: string; description: string };

export default function PageHeader({ icon, title, description }: Props) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{icon}</div>
      <h1 className="syne" style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
        {title}
      </h1>
      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
        {description}
      </p>
    </div>
  );
}