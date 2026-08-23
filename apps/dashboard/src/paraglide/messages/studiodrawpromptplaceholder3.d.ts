export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawpromptplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Describe the changes (optional)..." |
 *
 * @param {Studiodrawpromptplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawpromptplaceholder3: ((
  inputs?: Studiodrawpromptplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawpromptplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawpromptplaceholder3 as "studioDrawPromptPlaceholder" };
