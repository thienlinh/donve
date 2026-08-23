export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aisetdefaulterrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't set this connection as default. Try again." |
 *
 * @param {Aisetdefaulterrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aisetdefaulterrortoast4: ((
  inputs?: Aisetdefaulterrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aisetdefaulterrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aisetdefaulterrortoast4 as "aiSetDefaultErrorToast" };
