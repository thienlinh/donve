/** Real filenames aren't stored separately — derive `<Page>.html` from the project name. */
export function toHtmlFileName(name: string): string {
  const sanitized = name.trim().replace(/[/\\:*?"<>|]/g, "");
  return `${sanitized || "Page"}.html`;
}
