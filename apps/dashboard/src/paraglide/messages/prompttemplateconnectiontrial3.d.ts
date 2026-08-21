export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateconnectiontrial3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Trial" |
 *
 * @param {Prompttemplateconnectiontrial3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateconnectiontrial3: ((
  inputs?: Prompttemplateconnectiontrial3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateconnectiontrial3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateconnectiontrial3 as "promptTemplateConnectionTrial" };
