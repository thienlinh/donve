export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiomoreactionslabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Project actions" |
 *
 * @param {Studiomoreactionslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiomoreactionslabel3: ((
  inputs?: Studiomoreactionslabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiomoreactionslabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiomoreactionslabel3 as "studioMoreActionsLabel" };
