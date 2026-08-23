export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsnamelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Campaignsnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsnamelabel2: ((
  inputs?: Campaignsnamelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsnamelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsnamelabel2 as "campaignsNameLabel" };
