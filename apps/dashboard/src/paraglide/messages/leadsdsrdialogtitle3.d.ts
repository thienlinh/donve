export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrdialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Log a data-subject request" |
 *
 * @param {Leadsdsrdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrdialogtitle3: ((
  inputs?: Leadsdsrdialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrdialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrdialogtitle3 as "leadsDsrDialogTitle" };
