export type LocalizedString = import("../runtime.js").LocalizedString;
export type Resetpasswordinvalidlink3Inputs = {};
/**
 * | output |
 * | --- |
 * | "This password reset link is invalid or has expired." |
 *
 * @param {Resetpasswordinvalidlink3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const resetpasswordinvalidlink3: ((
  inputs?: Resetpasswordinvalidlink3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Resetpasswordinvalidlink3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { resetpasswordinvalidlink3 as "resetPasswordInvalidLink" };
