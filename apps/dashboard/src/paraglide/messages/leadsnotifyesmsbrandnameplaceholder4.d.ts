export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyesmsbrandnameplaceholder4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Your approved SMS sender name" |
 *
 * @param {Leadsnotifyesmsbrandnameplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyesmsbrandnameplaceholder4: ((
  inputs?: Leadsnotifyesmsbrandnameplaceholder4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyesmsbrandnameplaceholder4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyesmsbrandnameplaceholder4 as "leadsNotifyEsmsBrandnamePlaceholder" };
