export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsstartsatlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Starts" |
 *
 * @param {Campaignsstartsatlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsstartsatlabel3: ((
  inputs?: Campaignsstartsatlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsstartsatlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsstartsatlabel3 as "campaignsStartsAtLabel" };
