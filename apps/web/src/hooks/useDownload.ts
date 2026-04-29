import { useState, useEffect } from "react";
import type { FileResult } from "../services/imageApi";

export function useDownload() {
  const [url, setUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState("download");

  useEffect(() => {
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [url]);

  function setResult(result: FileResult) {
    setUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(result.blob);
    });
    setFilename(result.filename);
  }

  function clear() {
    setUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
  }

  return { url, filename, setResult, clear };
}