export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodeploystatussuperseded3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Previously live" |
 *
 * @param {Studiodeploystatussuperseded3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodeploystatussuperseded3: ((
  inputs?: Studiodeploystatussuperseded3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodeploystatussuperseded3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodeploystatussuperseded3 as "studioDeployStatusSuperseded" };
