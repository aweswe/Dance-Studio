/** Quote every field, double internal quotes, strip newlines (CSV injection-safe). */
export const escapeCsv = (value: unknown): string => {
  const s = String(value ?? "").replace(/[\r\n]+/g, " ");
  return `"${s.replace(/"/g, '""')}"`;
};
