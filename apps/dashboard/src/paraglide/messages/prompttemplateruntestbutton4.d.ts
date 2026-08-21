export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateruntestbutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Run test" |
 *
 * @param {Prompttemplateruntestbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateruntestbutton4: ((
  inputs?: Prompttemplateruntestbutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateruntestbutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateruntestbutton4 as "promptTemplateRunTestButton" };
