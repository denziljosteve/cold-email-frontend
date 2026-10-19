// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { extractTextFromFile, detectKind, formatFileSize } from "./fileExtraction";

function fileFromBytes(bytes: Uint8Array | string, name: string, type: string): File {
  const parts = typeof bytes === "string" ? [bytes] : [bytes as unknown as BlobPart];
  return new File(parts, name, { type });
}

describe("detectKind", () => {
  it("detects by extension when MIME is generic", () => {
    expect(detectKind(fileFromBytes("x", "resume.pdf", "application/octet-stream"))).toBe("pdf");
    expect(detectKind(fileFromBytes("x", "resume.docx", "application/octet-stream"))).toBe("docx");
    expect(detectKind(fileFromBytes("x", "resume.txt", "application/octet-stream"))).toBe("txt");
  });
  it("detects by MIME", () => {
    expect(detectKind(fileFromBytes("x", "a", "application/pdf"))).toBe("pdf");
    expect(
      detectKind(fileFromBytes("x", "a", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")),
    ).toBe("docx");
    expect(detectKind(fileFromBytes("x", "a", "text/plain"))).toBe("txt");
  });
  it("returns unknown for unsupported types", () => {
    expect(detectKind(fileFromBytes("x", "a.csv", "text/csv"))).toBe("unknown");
  });
});

describe("formatFileSize", () => {
  it("formats bytes, KB and MB", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.00 MB");
  });
});

describe("extractTextFromFile", () => {
  it("rejects an empty file without claiming success", async () => {
    const res = await extractTextFromFile(fileFromBytes("", "empty.txt", "text/plain"));
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/empty/i);
  });

  it("rejects an unsupported file type", async () => {
    const res = await extractTextFromFile(fileFromBytes("a,b\n1,2\n", "notes.csv", "text/csv"));
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/unsupported/i);
  });

  it("rejects a file over the size limit", async () => {
    const big = new File([new Uint8Array(6 * 1024 * 1024)], "big.txt", { type: "text/plain" });
    const res = await extractTextFromFile(big);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/too large/i);
  });

  it("extracts text from a TXT file", async () => {
    const res = await extractTextFromFile(fileFromBytes("Hello résumé 🚀", "r.txt", "text/plain"));
    expect(res.ok).toBe(true);
    expect(res.text).toBe("Hello résumé 🚀");
  });

  it("handles malformed PDF bytes gracefully", async () => {
    const res = await extractTextFromFile(fileFromBytes("not a real pdf at all", "bad.pdf", "application/pdf"));
    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it("never claims success with empty extracted content", async () => {
    // A whitespace-only text file has no usable content.
    const res = await extractTextFromFile(fileFromBytes("   \n\n   ", "w.txt", "text/plain"));
    expect(res.ok).toBe(false);
  });

  it("rejects a password-protected style malformed docx", async () => {
    const res = await extractTextFromFile(fileFromBytes("garbage bytes", "bad.docx", "application/octet-stream"));
    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
  });
});
