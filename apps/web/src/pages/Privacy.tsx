import { pageWrap } from "../lib/styles";

const SITE_NAME = "FileKit";
const CONTACT   = "filekit.io@gmail.com";

export default function Privacy() {
  return (
    <div style={{ ...pageWrap, maxWidth: "720px" }}>
      <h1 className="syne" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
        Privacy Policy
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "3rem" }}>
        Last updated: {new Date().toLocaleDateString("en-GB", { dateStyle: "long" })}
      </p>

      <Section title="Overview">
        <p>
          {SITE_NAME} provides free online file tools including image conversion, compression,
          and PDF processing. We are committed to protecting your privacy. This policy explains
          what information is collected when you use this site and how it is used.
        </p>
      </Section>

      <Section title="Files You Upload">
        <p>
          Files uploaded to {SITE_NAME} are processed entirely in memory on our servers and are
          <strong style={{ color: "var(--text)" }}> never saved, stored, or logged</strong>.
          They are discarded immediately after processing is complete. We have no access to
          the content of your files and do not share them with any third party.
        </p>
      </Section>

      <Section title="Server Logs">
        <p>
          Like most web servers, ours automatically records basic request information including
          IP addresses, browser type, and pages visited. This data is used solely for debugging
          and keeping the service running, is not shared with third parties, and is not used
          for tracking or advertising purposes.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          {SITE_NAME} does not currently use cookies. If we introduce advertising or analytics
          services in the future, this policy will be updated before any such services are enabled.
        </p>
      </Section>

      <Section title="Third-Party Links">
        <p>
          {SITE_NAME} may contain links to external websites. We are not responsible for the
          privacy practices or content of those sites and encourage you to review their privacy
          policies.
        </p>
      </Section>

      <Section title="Children's Privacy">
        <p>
          {SITE_NAME} is not directed at children under the age of 13. We do not knowingly
          collect personal information from children.
        </p>
      </Section>

      <Section title="Changes to This Policy">
        <p>
          We may update this privacy policy from time to time. Any changes will be posted on
          this page with an updated date. Continued use of the site after changes constitutes
          acceptance of the updated policy.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          If you have any questions about this privacy policy, you can contact us at{" "}
          <a href={`mailto:${CONTACT}`} style={{ color: "var(--accent)" }}>
            {CONTACT}
          </a>.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2 className="syne" style={{
        fontSize: "1.1rem",
        fontWeight: 700,
        marginBottom: "0.75rem",
        letterSpacing: "-0.02em",
        color: "var(--text)",
      }}>
        {title}
      </h2>
      <div style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {children}
      </div>
    </section>
  );
}