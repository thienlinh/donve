export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioautosavesaving2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Saving…" |
 *
 * @param {Studioautosavesaving2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioautosavesaving2: ((
  inputs?: Studioautosavesaving2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioautosavesaving2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioautosavesaving2 as "studioAutosaveSaving" };
