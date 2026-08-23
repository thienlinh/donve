export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiohidechat2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Hide chat" |
 *
 * @param {Studiohidechat2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiohidechat2: ((
  inputs?: Studiohidechat2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiohidechat2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiohidechat2 as "studioHideChat" };
