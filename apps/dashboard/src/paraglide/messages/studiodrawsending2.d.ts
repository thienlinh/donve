export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawsending2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Sending…" |
 *
 * @param {Studiodrawsending2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawsending2: ((
  inputs?: Studiodrawsending2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawsending2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawsending2 as "studioDrawSending" };
