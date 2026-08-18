export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectionsemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No connections yet" |
 *
 * @param {Aiconnectionsemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectionsemptytitle3: ((
  inputs?: Aiconnectionsemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectionsemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectionsemptytitle3 as "aiConnectionsEmptyTitle" };
