const ASSET_PATH_PREFIX = "/api/landings/";

/** Stored landing-page HTML references its own assets as root-relative `/api/landings/.../file`
 * paths — correct once *published* (buildPublishArtifacts rewrites those to the page's own
 * hashed static paths), but any in-app preview/editor renders the HTML inside an iframe via
 * `srcDoc`, which resolves root-relative paths against the app's own origin, not the API's.
 * Absolutize just for these previews so `<img>`/`<video>` requests actually hit the API. */
export function absolutizeAssetPaths(html: string): string {
  return html.replaceAll(
    /((?:src|poster)=")\/api\/landings\//g,
    `$1${import.meta.env.VITE_API_URL}${ASSET_PATH_PREFIX}`
  );
}

/** Inverse of `absolutizeAssetPaths` — the Studio canvas editor persists its iframe's live
 * `outerHTML` back as the page's source on every save, so an absolutized `srcDoc` would
 * otherwise bake the API's absolute origin into the stored/published HTML. Call this on
 * whatever gets read back out of an absolutized iframe before it's saved. */
export function deabsolutizeAssetPaths(html: string): string {
  return html.replaceAll(
    `${import.meta.env.VITE_API_URL}${ASSET_PATH_PREFIX}`,
    ASSET_PATH_PREFIX
  );
}
