import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";

// Image pages
import Convert      from "./pages/image/Convert";
import Resize       from "./pages/image/Resize";
import Compress     from "./pages/image/Compress";
import Grayscale    from "./pages/image/Grayscale";
import Watermark    from "./pages/image/Watermark";
import StripMetadata from "./pages/image/StripMetadata";
import ToPdf        from "./pages/image/ToPdf";
import Info         from "./pages/image/Info";

// PDF pages
import Merge        from "./pages/pdf/Merge";
import Metadata     from "./pages/pdf/Metadata";
import RotatePages  from "./pages/pdf/RotatePages";
import Protect      from "./pages/pdf/Protect";
import PdfWatermark from "./pages/pdf/Watermark";
import JsonFormatter  from "./pages/data/JsonFormatter";
import JsonToCsv      from "./pages/data/JsonToCsv";
import CsvToJson      from "./pages/data/CsvToJson";
import JsonToXml      from "./pages/data/JsonToXml";
import XmlToJson      from "./pages/data/XmlToJson";
import PdfToText      from "./pages/pdf/PdfToText";
import PdfToWord      from "./pages/pdf/PdfToWord";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Image */}
        <Route path="/image/convert"        element={<Convert />} />
        <Route path="/image/resize"         element={<Resize />} />
        <Route path="/image/compress"       element={<Compress />} />
        <Route path="/image/grayscale"      element={<Grayscale />} />
        <Route path="/image/watermark"      element={<Watermark />} />
        <Route path="/image/strip-metadata" element={<StripMetadata />} />
        <Route path="/image/to-pdf"         element={<ToPdf />} />
        <Route path="/image/info"           element={<Info />} />

        {/* PDF */}
        <Route path="/pdf/merge"            element={<Merge />} />
        <Route path="/pdf/metadata"         element={<Metadata />} />
        <Route path="/pdf/rotate-pages"     element={<RotatePages />} />
        <Route path="/pdf/protect"          element={<Protect />} />
        <Route path="/pdf/watermark"        element={<PdfWatermark />} />
        <Route path="/data/json-formatter" element={<JsonFormatter />} />
        <Route path="/data/json-to-csv"    element={<JsonToCsv />} />
        <Route path="/data/csv-to-json"    element={<CsvToJson />} />
        <Route path="/data/json-to-xml"    element={<JsonToXml />} />
        <Route path="/data/xml-to-json"    element={<XmlToJson />} />
        <Route path="/pdf/to-text"         element={<PdfToText />} />
        <Route path="/pdf/to-word" element={<PdfToWord />} />
      </Routes>
    </Layout>
  );
}