export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiorollbackerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't roll back. Try again." |
 *
 * @param {Studiorollbackerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiorollbackerrortoast3: ((
  inputs?: Studiorollbackerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiorollbackerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiorollbackerrortoast3 as "studioRollbackErrorToast" };
