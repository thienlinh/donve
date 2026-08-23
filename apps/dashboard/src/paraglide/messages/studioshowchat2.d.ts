export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioshowchat2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Show chat" |
 *
 * @param {Studioshowchat2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioshowchat2: ((
  inputs?: Studioshowchat2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioshowchat2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioshowchat2 as "studioShowChat" };
