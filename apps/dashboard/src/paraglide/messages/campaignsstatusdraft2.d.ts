export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsstatusdraft2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Draft" |
 *
 * @param {Campaignsstatusdraft2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsstatusdraft2: ((
  inputs?: Campaignsstatusdraft2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsstatusdraft2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsstatusdraft2 as "campaignsStatusDraft" };
