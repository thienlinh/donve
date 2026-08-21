export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodeploystatusunpublished3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Unpublished" |
 *
 * @param {Studiodeploystatusunpublished3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodeploystatusunpublished3: ((
  inputs?: Studiodeploystatusunpublished3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodeploystatusunpublished3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodeploystatusunpublished3 as "studioDeployStatusUnpublished" };
