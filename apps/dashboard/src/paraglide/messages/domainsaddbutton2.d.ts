export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsaddbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add domain" |
 *
 * @param {Domainsaddbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsaddbutton2: ((
  inputs?: Domainsaddbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsaddbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsaddbutton2 as "domainsAddButton" };
