import { useCallback, useState } from "react";
import type { ResumeState } from "../types/careerCoach";
import { extractTextFromFile, formatFileSize } from "../lib/fileExtraction";

export interface FileMeta {
  name: string;
  size: number;
  sizeLabel: string;
}

interface Options {
  onExtract: (update: Partial<ResumeState>) => void;
}

/** Handles resume file selection, extraction status and errors. */
export function useFileExtraction({ onExtract }: Options) {
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setStatus("processing");
      setError(null);
      setFileMeta({ name: file.name, size: file.size, sizeLabel: formatFileSize(file.size) });

      const result = await extractTextFromFile(file);

      if (result.ok) {
        setStatus("done");
        setError(null);
        onExtract({
          text: result.text,
          fileName: file.name,
          fileSize: file.size,
        });
      } else {
        setStatus("error");
        setError(result.error ?? "Extraction failed.");
        // Keep any existing text — never silently discard it.
        onExtract({ fileName: file.name, fileSize: file.size });
      }
    },
    [onExtract],
  );

  const clearFile = useCallback(() => {
    setFileMeta(null);
    setStatus("idle");
    setError(null);
    onExtract({ fileName: null, fileSize: null });
  }, [onExtract]);

  return { status, error, fileMeta, processFile, clearFile, setError };
}
