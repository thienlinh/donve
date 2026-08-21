export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateaddsection3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add section" |
 *
 * @param {Prompttemplateaddsection3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateaddsection3: ((
  inputs?: Prompttemplateaddsection3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateaddsection3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateaddsection3 as "promptTemplateAddSection" };
