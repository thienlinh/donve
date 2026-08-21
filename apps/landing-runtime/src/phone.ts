// ponytail: hand-rolled VN normalization instead of libphonenumber-js — that lib is the right
// call for the dashboard bundle (tech-stack.md) but far too heavy for this ~5-8KB budget. This
// is client-side UX only; the API is the source of truth and re-validates on submit.
export function normalizeVnPhone(raw: string): string | null {
  const digits = raw.replace(/[\s.-]/g, "");
  const match = /^(?:\+84|84|0)(\d{9})$/.exec(digits);
  return match ? `+84${match[1]}` : null;
}
