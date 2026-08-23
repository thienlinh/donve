export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatelighthouseunavailable3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Lighthouse unavailable on this runtime" |
 *
 * @param {Prompttemplatelighthouseunavailable3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatelighthouseunavailable3: ((
  inputs?: Prompttemplatelighthouseunavailable3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatelighthouseunavailable3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatelighthouseunavailable3 as "promptTemplateLighthouseUnavailable" };
