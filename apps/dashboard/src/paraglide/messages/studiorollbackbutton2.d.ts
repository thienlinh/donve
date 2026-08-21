export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiorollbackbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Rollback" |
 *
 * @param {Studiorollbackbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiorollbackbutton2: ((
  inputs?: Studiorollbackbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiorollbackbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiorollbackbutton2 as "studioRollbackButton" };
