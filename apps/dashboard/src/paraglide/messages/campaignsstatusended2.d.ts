export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsstatusended2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Ended" |
 *
 * @param {Campaignsstatusended2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsstatusended2: ((
  inputs?: Campaignsstatusended2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsstatusended2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsstatusended2 as "campaignsStatusEnded" };
