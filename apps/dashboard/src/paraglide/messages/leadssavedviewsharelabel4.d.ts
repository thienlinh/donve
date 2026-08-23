export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssavedviewsharelabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Share with the whole team" |
 *
 * @param {Leadssavedviewsharelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssavedviewsharelabel4: ((
  inputs?: Leadssavedviewsharelabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssavedviewsharelabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssavedviewsharelabel4 as "leadsSavedViewShareLabel" };
