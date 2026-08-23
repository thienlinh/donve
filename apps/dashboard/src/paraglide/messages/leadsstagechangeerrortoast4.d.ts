export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsstagechangeerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't move this lead. Try again." |
 *
 * @param {Leadsstagechangeerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsstagechangeerrortoast4: ((
  inputs?: Leadsstagechangeerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsstagechangeerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsstagechangeerrortoast4 as "leadsStageChangeErrorToast" };
