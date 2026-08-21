export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignscolumnactions2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Campaignscolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignscolumnactions2: ((
  inputs?: Campaignscolumnactions2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignscolumnactions2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignscolumnactions2 as "campaignsColumnActions" };
