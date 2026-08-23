export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkchangestage3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Change stage" |
 *
 * @param {Leadsbulkchangestage3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkchangestage3: ((
  inputs?: Leadsbulkchangestage3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkchangestage3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkchangestage3 as "leadsBulkChangeStage" };
