export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkclearselection3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Clear selection" |
 *
 * @param {Leadsbulkclearselection3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkclearselection3: ((
  inputs?: Leadsbulkclearselection3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkclearselection3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkclearselection3 as "leadsBulkClearSelection" };
