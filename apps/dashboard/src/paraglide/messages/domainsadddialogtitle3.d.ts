export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsadddialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add a custom domain" |
 *
 * @param {Domainsadddialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsadddialogtitle3: ((
  inputs?: Domainsadddialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsadddialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsadddialogtitle3 as "domainsAddDialogTitle" };
