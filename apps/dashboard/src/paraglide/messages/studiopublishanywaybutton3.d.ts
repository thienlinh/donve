export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishanywaybutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Publish anyway" |
 *
 * @param {Studiopublishanywaybutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishanywaybutton3: ((
  inputs?: Studiopublishanywaybutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishanywaybutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishanywaybutton3 as "studioPublishAnywayButton" };
