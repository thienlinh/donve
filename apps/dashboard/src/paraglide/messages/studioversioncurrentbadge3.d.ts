export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversioncurrentbadge3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Current" |
 *
 * @param {Studioversioncurrentbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversioncurrentbadge3: ((
  inputs?: Studioversioncurrentbadge3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversioncurrentbadge3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversioncurrentbadge3 as "studioVersionCurrentBadge" };
