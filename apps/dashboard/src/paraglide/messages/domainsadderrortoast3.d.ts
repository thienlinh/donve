export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsadderrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't add this domain. Check it isn't already in use and try again." |
 *
 * @param {Domainsadderrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsadderrortoast3: ((
  inputs?: Domainsadderrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsadderrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsadderrortoast3 as "domainsAddErrorToast" };
