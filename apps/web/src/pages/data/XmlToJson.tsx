import { useEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import TextTool from "../../components/TextTool";
import PageHeader from "../../components/ui/PageHeader";
import { pageWrap } from "../../lib/styles";

export default function XmlToJson() {
  useEffect(() => { document.title = "Convert XML to JSON Free Online — FileKit"; }, []);

  const convert = (input: string) => {
    const parser = new XMLParser();
    const result = parser.parse(input);
    return JSON.stringify(result, null, 2);
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="⇄" title="XML to JSON" description="Convert XML to JSON format instantly." />
      <TextTool
        inputLabel="Input XML"
        outputLabel="Output JSON"
        inputPlaceholder={"<user>\n  <name>Alice</name>\n  <age>30</age>\n</user>"}
        accept=".xml"
        onConvert={convert}
        convertLabel="Convert to JSON"
        downloadExt="json"
      />
    </div>
  );
}