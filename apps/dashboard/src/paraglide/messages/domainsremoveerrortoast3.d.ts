export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsremoveerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't remove this domain. Try again." |
 *
 * @param {Domainsremoveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsremoveerrortoast3: ((
  inputs?: Domainsremoveerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsremoveerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsremoveerrortoast3 as "domainsRemoveErrorToast" };
