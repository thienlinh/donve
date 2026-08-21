export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsaccountnamelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Account name" |
 *
 * @param {Campaignsaccountnamelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsaccountnamelabel3: ((
  inputs?: Campaignsaccountnamelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsaccountnamelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsaccountnamelabel3 as "campaignsAccountNameLabel" };
