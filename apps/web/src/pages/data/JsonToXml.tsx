import { useEffect } from "react";
import { XMLBuilder } from "fast-xml-parser";
import TextTool from "../../components/TextTool";
import PageHeader from "../../components/ui/PageHeader";
import { pageWrap } from "../../lib/styles";

export default function JsonToXml() {
  useEffect(() => { document.title = "Convert JSON to XML Free Online — FileKit"; }, []);

  const convert = (input: string) => {
    const parsed = JSON.parse(input);
    const builder = new XMLBuilder({ format: true });
    return builder.build(parsed);
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="⇄" title="JSON to XML" description="Convert JSON to XML format instantly." />
      <TextTool
        inputLabel="Input JSON"
        outputLabel="Output XML"
        inputPlaceholder='{"user":{"name":"Alice","age":30}}'
        accept=".json"
        onConvert={convert}
        convertLabel="Convert to XML"
        downloadExt="xml"
      />
    </div>
  );
}