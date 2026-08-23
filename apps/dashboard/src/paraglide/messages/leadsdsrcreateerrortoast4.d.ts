export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrcreateerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't log this request. Try again." |
 *
 * @param {Leadsdsrcreateerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrcreateerrortoast4: ((
  inputs?: Leadsdsrcreateerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrcreateerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrcreateerrortoast4 as "leadsDsrCreateErrorToast" };
