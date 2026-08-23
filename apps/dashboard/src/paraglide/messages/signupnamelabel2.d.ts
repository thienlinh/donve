export type LocalizedString = import("../runtime.js").LocalizedString;
export type Signupnamelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Full name" |
 *
 * @param {Signupnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const signupnamelabel2: ((
  inputs?: Signupnamelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Signupnamelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { signupnamelabel2 as "signupNameLabel" };
