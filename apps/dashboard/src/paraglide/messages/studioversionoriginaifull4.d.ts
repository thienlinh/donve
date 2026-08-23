export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionoriginaifull4Inputs = {};
/**
 * | output |
 * | --- |
 * | "AI generated" |
 *
 * @param {Studioversionoriginaifull4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionoriginaifull4: ((
  inputs?: Studioversionoriginaifull4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionoriginaifull4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionoriginaifull4 as "studioVersionOriginAiFull" };
