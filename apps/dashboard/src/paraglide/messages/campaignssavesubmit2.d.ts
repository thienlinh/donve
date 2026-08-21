export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignssavesubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Campaignssavesubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignssavesubmit2: ((
  inputs?: Campaignssavesubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignssavesubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignssavesubmit2 as "campaignsSaveSubmit" };
