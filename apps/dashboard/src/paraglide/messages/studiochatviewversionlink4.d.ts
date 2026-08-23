export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiochatviewversionlink4Inputs = {};
/**
 * | output |
 * | --- |
 * | "View this version" |
 *
 * @param {Studiochatviewversionlink4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiochatviewversionlink4: ((
  inputs?: Studiochatviewversionlink4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiochatviewversionlink4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiochatviewversionlink4 as "studioChatViewVersionLink" };
