/**
 * Minimal RFC-4180-ish CSV parser — no dependencies.
 * Handles: quoted fields, embedded commas, escaped quotes ("" -> "),
 * \r\n / \n / \r line endings, a leading BOM, and a trailing newline.
 * Returns rows of raw string cells; trimming/coercion is the schema's job.
 */
export function parseCsv(input: string): string[][] {
  // Strip a leading UTF-8 BOM if present.
  const s = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const n = s.length;

  const endField = () => {
    row.push(field);
    field = "";
  };
  const endRow = () => {
    endField();
    rows.push(row);
    row = [];
  };

  while (i < n) {
    const c = s[i];

    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      endField();
      i++;
      continue;
    }
    if (c === "\r") {
      if (s[i + 1] === "\n") i++;
      endRow();
      i++;
      continue;
    }
    if (c === "\n") {
      endRow();
      i++;
      continue;
    }
    field += c;
    i++;
  }

  // Flush the final field/row (no trailing newline case).
  if (field.length > 0 || row.length > 0) endRow();

  return rows;
}
