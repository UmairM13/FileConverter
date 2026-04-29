import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ToolPageRoute from "./pages/ToolPageRoute";
import { IMAGE_TOOLS, PDF_TOOLS } from "./tools";

export default function App() {
  const allTools = [...IMAGE_TOOLS, ...PDF_TOOLS];

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {allTools.map(tool => (
          <Route
            key={tool.id}
            path={`/${tool.endpoint.split("/")[1]}/${tool.id}`}
            element={<ToolPageRoute tool={tool} />}
          />
        ))}
      </Routes>
    </Layout>
  );
}