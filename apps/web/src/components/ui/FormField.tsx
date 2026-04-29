import { labelStyle } from "../../lib/styles";

type Props = { label: string; children: React.ReactNode };

export default function FormField({ label, children }: Props) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}