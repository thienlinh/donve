export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatesectionkeyplaceholder4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Section key" |
 *
 * @param {Prompttemplatesectionkeyplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatesectionkeyplaceholder4: ((
  inputs?: Prompttemplatesectionkeyplaceholder4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatesectionkeyplaceholder4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatesectionkeyplaceholder4 as "promptTemplateSectionKeyPlaceholder" };
