/* Generates local test fixtures for PDF/DOCX/TXT extraction testing. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "fixtures");
fs.mkdirSync(dir, { recursive: true });

// --- TXT ---
fs.writeFileSync(
  path.join(dir, "resume.txt"),
  "Jane Doe — Senior Backend Engineer\nDistributed systems in Go and Python; 8 years experience.\n",
  "utf8",
);

// --- DOCX (minimal, valid OpenXML) ---
const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Jane Doe DOCX Resume</w:t></w:r></w:p>
    <w:p><w:r><w:t>Staff engineer with Kubernetes and Go. Cut cloud costs 30%.</w:t></w:r></w:p>
  </w:body>
</w:document>`;
const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const zip = new JSZip();
zip.file("[Content_Types].xml", contentTypes);
zip.file("_rels/.rels", rels);
zip.file("word/document.xml", docXml);
const docxBuf = await zip.generateAsync({
  type: "nodebuffer",
  mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
});
fs.writeFileSync(path.join(dir, "resume.docx"), docxBuf);

// --- PDF (minimal valid, uncompressed text stream) ---
const text = "Jane Doe PDF Resume. Senior engineer. Kubernetes and Go. Reduced costs 30 percent.";
const stream = `BT /F1 12 Tf 50 750 Td (${text}) Tj ET`;
const objs = [
  "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
  "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
  "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
  `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
  "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
];
let pdf = "%PDF-1.4\n";
const offsets = [0];
for (const o of objs) {
  offsets.push(pdf.length);
  pdf += o + "\n";
}
const xrefPos = pdf.length;
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objs.length; i++) {
  pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
}
pdf += `trailer << /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
fs.writeFileSync(path.join(dir, "resume.pdf"), pdf, "latin1");

// --- Empty + unsupported fixtures ---
fs.writeFileSync(path.join(dir, "empty.txt"), "", "utf8");
fs.writeFileSync(path.join(dir, "notes.csv"), "a,b\n1,2\n", "utf8");

for (const f of fs.readdirSync(dir)) {
  console.log(f, fs.statSync(path.join(dir, f)).size, "bytes");
}
