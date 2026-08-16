export type LocalizedString = import("../runtime.js").LocalizedString;
export type Loginemaillabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Loginemaillabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const loginemaillabel2: ((
  inputs?: Loginemaillabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Loginemaillabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { loginemaillabel2 as "loginEmailLabel" };
