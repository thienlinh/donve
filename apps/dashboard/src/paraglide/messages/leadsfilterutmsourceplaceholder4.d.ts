export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterutmsourceplaceholder4Inputs = {};
/**
 * | output |
 * | --- |
 * | "e.g. facebook" |
 *
 * @param {Leadsfilterutmsourceplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterutmsourceplaceholder4: ((
  inputs?: Leadsfilterutmsourceplaceholder4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterutmsourceplaceholder4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterutmsourceplaceholder4 as "leadsFilterUtmSourcePlaceholder" };
