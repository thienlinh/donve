export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateremoveconfirmbody4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Landing pages using it will fall back to the platform default." |
 *
 * @param {Prompttemplateremoveconfirmbody4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateremoveconfirmbody4: ((
  inputs?: Prompttemplateremoveconfirmbody4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateremoveconfirmbody4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateremoveconfirmbody4 as "promptTemplateRemoveConfirmBody" };
