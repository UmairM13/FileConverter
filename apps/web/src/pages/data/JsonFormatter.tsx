import { useEffect } from "react";
import TextTool from "../../components/TextTool";
import PageHeader from "../../components/ui/PageHeader";
import { pageWrap } from "../../lib/styles";

export default function JsonFormatter() {
  useEffect(() => { document.title = "JSON Formatter & Prettifier Free Online — FileKit"; }, []);

  const format = (input: string) => {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="🧹" title="JSON Formatter" description="Paste or upload JSON to format and prettify it instantly." />
      <TextTool
        inputLabel="Input JSON"
        outputLabel="Formatted JSON"
        inputPlaceholder='{"name":"FileKit","free":true}'
        accept=".json"
        onConvert={format}
        convertLabel="Format JSON"
        downloadExt="json"
      />
    </div>
  );
}