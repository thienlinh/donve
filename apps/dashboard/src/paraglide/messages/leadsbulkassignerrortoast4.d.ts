export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkassignerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't assign the selected leads. Try again." |
 *
 * @param {Leadsbulkassignerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkassignerrortoast4: ((
  inputs?: Leadsbulkassignerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkassignerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkassignerrortoast4 as "leadsBulkAssignErrorToast" };
