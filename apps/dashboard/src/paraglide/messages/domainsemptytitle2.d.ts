export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsemptytitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "No custom domain yet" |
 *
 * @param {Domainsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsemptytitle2: ((
  inputs?: Domainsemptytitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsemptytitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsemptytitle2 as "domainsEmptyTitle" };
