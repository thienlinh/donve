export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssavedviewdeletelabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Delete view" |
 *
 * @param {Leadssavedviewdeletelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssavedviewdeletelabel4: ((
  inputs?: Leadssavedviewdeletelabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssavedviewdeletelabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssavedviewdeletelabel4 as "leadsSavedViewDeleteLabel" };
