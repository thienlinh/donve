export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioautosavesaved2Inputs = {
  time: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Saved {time}" |
 *
 * @param {Studioautosavesaved2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioautosavesaved2: ((
  inputs: Studioautosavesaved2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioautosavesaved2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioautosavesaved2 as "studioAutosaveSaved" };
