export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodeployhistorytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Deploy history" |
 *
 * @param {Studiodeployhistorytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodeployhistorytitle3: ((
  inputs?: Studiodeployhistorytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodeployhistorytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodeployhistorytitle3 as "studioDeployHistoryTitle" };
