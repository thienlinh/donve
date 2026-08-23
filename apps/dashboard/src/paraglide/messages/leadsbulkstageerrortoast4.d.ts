export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkstageerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't change stage for the selected leads. Try again." |
 *
 * @param {Leadsbulkstageerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkstageerrortoast4: ((
  inputs?: Leadsbulkstageerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkstageerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkstageerrortoast4 as "leadsBulkStageErrorToast" };
