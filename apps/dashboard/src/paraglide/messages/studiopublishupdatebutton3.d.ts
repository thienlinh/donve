export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishupdatebutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Publish update" |
 *
 * @param {Studiopublishupdatebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishupdatebutton3: ((
  inputs?: Studiopublishupdatebutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishupdatebutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishupdatebutton3 as "studioPublishUpdateButton" };
