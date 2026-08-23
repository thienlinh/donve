export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersemaillabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Membersemaillabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersemaillabel2: ((
  inputs?: Membersemaillabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersemaillabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersemaillabel2 as "membersEmailLabel" };
