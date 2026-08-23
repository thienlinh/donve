export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsstatuspaused2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paused" |
 *
 * @param {Campaignsstatuspaused2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsstatuspaused2: ((
  inputs?: Campaignsstatuspaused2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsstatuspaused2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsstatuspaused2 as "campaignsStatusPaused" };
