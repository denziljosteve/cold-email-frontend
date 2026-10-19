import { APP_CONFIG } from "../config/defaultInstructions";

// Heavy libraries (pdf.js, mammoth) are lazily imported so the initial
// bundle stays small. This also avoids broken CDN globals — everything is
// bundled and the pdf.js worker is resolved locally.

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  return pdfjs;
}

async function loadMammoth() {
  const mod = await import("mammoth/mammoth.browser");
  return mod.default;
}

export type ExtractKind = "pdf" | "docx" | "txt" | "unknown";

export interface ExtractionResult {
  ok: boolean;
  text: string;
  error?: string;
  /** True when the file likely needs OCR (e.g. scanned/image-only PDF). */
  needsOcr?: boolean;
}

const MIME_MAP: Record<string, ExtractKind> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "text/plain": "txt",
  "text/markdown": "txt",
};

export function detectKind(file: File): ExtractKind {
  const byMime = MIME_MAP[file.type.toLowerCase()];
  if (byMime) return byMime;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".text")) return "txt";
  return "unknown";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Read a File as UTF-8 text.
 * Uses Blob.text() where available and falls back to FileReader, which keeps
 * this working in older browsers and in test environments that only implement
 * the FileReader path.
 */
export function readFileAsText(file: File): Promise<string> {
  if (typeof file.text === "function") return file.text();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the file."));
    reader.readAsText(file);
  });
}

/** Read a File as an ArrayBuffer, with a FileReader fallback. */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === "function") return file.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the file."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extract text from a user-supplied file entirely in the browser.
 * The file is never uploaded. Failures are reported honestly — a scanned
 * PDF with no text layer returns ok:false and flags that OCR is required.
 */
export async function extractTextFromFile(file: File): Promise<ExtractionResult> {
  if (file.size === 0) {
    return { ok: false, text: "", error: "The file is empty (0 bytes)." };
  }
  if (file.size > APP_CONFIG.maxFileBytes) {
    return {
      ok: false,
      text: "",
      error: `File is too large (${formatFileSize(file.size)}). Limit is ${formatFileSize(APP_CONFIG.maxFileBytes)}.`,
    };
  }

  const kind = detectKind(file);
  if (kind === "unknown") {
    return {
      ok: false,
      text: "",
      error: "Unsupported file type. Accepted formats are PDF, DOCX and TXT.",
    };
  }

  try {
    if (kind === "txt") {
      const text = await readFileAsText(file);
      if (!text.trim()) {
        return { ok: false, text: "", error: "The text file contains no usable content." };
      }
      return { ok: true, text };
    }

    const buffer = await readFileAsArrayBuffer(file);

    if (kind === "docx") {
      const mammoth = await loadMammoth();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      const text = (result.value || "").trim();
      if (!text) {
        return {
          ok: false,
          text: "",
          error:
            "No text could be extracted from the DOCX. It may be image-based — copy the text and paste it manually.",
        };
      }
      return { ok: true, text };
    }

    // PDF
    const pdfjsLib = await loadPdfjs();
    let doc: Awaited<ReturnType<typeof pdfjsLib.getDocument>["promise"]>;
    try {
      doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/password/i.test(msg)) {
        return {
          ok: false,
          text: "",
          error: "This PDF is password-protected. Remove the password or paste the text manually.",
        };
      }
      return { ok: false, text: "", error: `Could not open the PDF: ${msg}` };
    }

    const parts: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .trim();
      if (pageText) parts.push(pageText);
      page.cleanup();
    }
    await doc.destroy();

    const text = parts.join("\n\n").trim();
    if (!text) {
      return {
        ok: false,
        text: "",
        needsOcr: true,
        error:
          "No selectable text was found — this looks like a scanned or image-only PDF. OCR would be required; please paste the text manually.",
      };
    }
    return { ok: true, text };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, text: "", error: `Extraction failed: ${msg}` };
  }
}
