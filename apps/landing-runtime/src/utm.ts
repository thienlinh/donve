/** `tracking-and-attribution.md` §UTM governance — scrapes `utm_*` query params off the current
 * URL. Shared by the `page_viewed` beacon and the lead-submit payload so both capture the same
 * first-touch snapshot instead of two independent implementations drifting apart. */
export function utmFromLocation(): Record<string, string> {
  const utm: Record<string, string> = {};
  for (const [key, value] of new URL(location.href).searchParams) {
    if (key.startsWith("utm_")) utm[key] = value;
  }
  return utm;
}
