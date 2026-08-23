export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkdeleteerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't delete the selected leads. Try again." |
 *
 * @param {Leadsbulkdeleteerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkdeleteerrortoast4: ((
  inputs?: Leadsbulkdeleteerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkdeleteerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkdeleteerrortoast4 as "leadsBulkDeleteErrorToast" };
