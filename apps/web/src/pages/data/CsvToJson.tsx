import { useEffect } from "react";
import Papa from "papaparse";
import TextTool from "../../components/TextTool";
import PageHeader from "../../components/ui/PageHeader";
import { pageWrap } from "../../lib/styles";

export default function CsvToJson() {
  useEffect(() => { document.title = "Convert CSV to JSON Free Online — FileKit"; }, []);

  const convert = (input: string) => {
    const result = Papa.parse(input, { header: true, skipEmptyLines: true });
    if (result.errors.length) throw new Error(result.errors[0]?.message ?? "CSV parse error");
    return JSON.stringify(result.data, null, 2);
  };

  return (
    <div style={pageWrap}>
      <PageHeader icon="⇄" title="CSV to JSON" description="Convert CSV files to JSON format instantly." />
      <TextTool
        inputLabel="Input CSV"
        outputLabel="Output JSON"
        inputPlaceholder={"name,age\nAlice,30\nBob,25"}
        accept=".csv"
        onConvert={convert}
        convertLabel="Convert to JSON"
        downloadExt="json"
      />
    </div>
  );
}