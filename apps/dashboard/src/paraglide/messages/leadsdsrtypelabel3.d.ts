export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrtypelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Request type" |
 *
 * @param {Leadsdsrtypelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrtypelabel3: ((
  inputs?: Leadsdsrtypelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrtypelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrtypelabel3 as "leadsDsrTypeLabel" };
