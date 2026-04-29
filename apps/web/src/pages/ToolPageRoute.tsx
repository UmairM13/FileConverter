import ToolPage from "../components/ToolPage";
import type { ToolConfig } from "../tools";

export default function ToolPageRoute({ tool }: { tool: ToolConfig }) {
    return <ToolPage tool={tool} />;
}