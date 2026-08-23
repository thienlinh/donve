export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssavedviewnameplaceholder4Inputs = {};
/**
 * | output |
 * | --- |
 * | "E.g. New unassigned leads" |
 *
 * @param {Leadssavedviewnameplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssavedviewnameplaceholder4: ((
  inputs?: Leadssavedviewnameplaceholder4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssavedviewnameplaceholder4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssavedviewnameplaceholder4 as "leadsSavedViewNamePlaceholder" };
