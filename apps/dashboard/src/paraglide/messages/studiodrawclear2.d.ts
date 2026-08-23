export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawclear2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Clear all" |
 *
 * @param {Studiodrawclear2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawclear2: ((
  inputs?: Studiodrawclear2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawclear2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawclear2 as "studioDrawClear" };
