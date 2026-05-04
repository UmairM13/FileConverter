import { useEffect } from "react";
import Papa from "papaparse";
import TextTool from "../../components/TextTool";
import PageHeader from "../../components/ui/PageHeader";
import { pageWrap } from "../../lib/styles";

export default function JsonToCsv() {
  useEffect(() => { document.title = "Convert JSON to CSV Free Online — FileKit"; }, []);

  const convert = (input: string) => {
    const parsed = JSON.parse(input);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    const hasNested = arr.some(row =>
    Object.values(row).some(v => typeof v === "object" && v !== null)
    );

    if (hasNested) {
      throw new Error("JSON contains nested objects or arrays. CSV only supports flat data. Please provide a flat array of objects.");
    }

    return Papa.unparse(arr);
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="⇄" title="JSON to CSV" description="Convert JSON arrays to CSV format instantly." />
      <TextTool
        inputLabel="Input JSON"
        outputLabel="Output CSV"
        inputPlaceholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
        accept=".json"
        onConvert={convert}
        convertLabel="Convert to CSV"
        downloadExt="csv"
      />
    </div>
  );
}