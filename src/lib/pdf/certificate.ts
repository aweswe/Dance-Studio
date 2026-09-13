function pdfEscape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

export function buildCertificatePdf(opts: {
  studentName: string;
  programme: string;
  level?: string;
}): Uint8Array {
  const name = pdfEscape(opts.studentName);
  const programme = pdfEscape(opts.programme);
  const level = pdfEscape(opts.level || "Completion");
  const content = [
    "BT",
    "/F1 28 Tf",
    "72 720 Td",
    "(RHYTHMZZ ACADEMY OF DANCE) Tj",
    "0 -36 Td",
    "/F1 16 Tf",
    "(Certificate of Completion) Tj",
    "0 -48 Td",
    "/F1 12 Tf",
    "(This is presented to) Tj",
    "0 -28 Td",
    "/F1 22 Tf",
    `(${name}) Tj`,
    "0 -32 Td",
    "/F1 12 Tf",
    `(for ${level} in ${programme}) Tj`,
    "0 -48 Td",
    "/F1 10 Tf",
    "(Neredmet X Road, Secunderabad  -  rhythmzz.in) Tj",
    "ET",
  ].join("\n");

  const stream = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
    `4 0 obj ${stream} endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >> endobj",
  ];

  let body = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(body.length);
    body += obj + "\n";
  }
  const xrefStart = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new TextEncoder().encode(body);
}
