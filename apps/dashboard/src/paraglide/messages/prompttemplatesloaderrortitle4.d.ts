export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatesloaderrortitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load prompt templates" |
 *
 * @param {Prompttemplatesloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatesloaderrortitle4: ((
  inputs?: Prompttemplatesloaderrortitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatesloaderrortitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatesloaderrortitle4 as "promptTemplatesLoadErrorTitle" };
