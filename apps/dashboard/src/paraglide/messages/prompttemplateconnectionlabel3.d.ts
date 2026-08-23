export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateconnectionlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Model connection" |
 *
 * @param {Prompttemplateconnectionlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateconnectionlabel3: ((
  inputs?: Prompttemplateconnectionlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateconnectionlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateconnectionlabel3 as "promptTemplateConnectionLabel" };
