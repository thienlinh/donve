export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionoriginaipatch4Inputs = {};
/**
 * | output |
 * | --- |
 * | "AI tweak" |
 *
 * @param {Studioversionoriginaipatch4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionoriginaipatch4: ((
  inputs?: Studioversionoriginaipatch4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionoriginaipatch4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionoriginaipatch4 as "studioVersionOriginAiPatch" };
