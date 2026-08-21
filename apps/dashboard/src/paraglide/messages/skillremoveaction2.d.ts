export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillremoveaction2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove skill" |
 *
 * @param {Skillremoveaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillremoveaction2: ((
  inputs?: Skillremoveaction2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillremoveaction2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillremoveaction2 as "skillRemoveAction" };
