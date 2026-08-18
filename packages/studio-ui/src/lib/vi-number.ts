/** Parses a vi-VN formatted number ("0,86", "−0,16") into a CSS-ready number. */
export function parseViNumber(input: string): number | null {
  const normalized = input.trim().replace(/−/g, "-").replace(",", ".");
  if (normalized === "") return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/** Formats a number for vi-VN display ("0.86" -> "0,86"). */
export function formatViNumber(value: number): string {
  return String(value).replace(".", ",");
}
