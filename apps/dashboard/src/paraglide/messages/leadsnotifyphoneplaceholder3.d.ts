export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyphoneplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "e.g. 0912345678" |
 *
 * @param {Leadsnotifyphoneplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyphoneplaceholder3: ((
  inputs?: Leadsnotifyphoneplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyphoneplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyphoneplaceholder3 as "leadsNotifyPhonePlaceholder" };
