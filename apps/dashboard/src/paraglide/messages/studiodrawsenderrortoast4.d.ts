export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawsenderrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't send the drawing. Try again." |
 *
 * @param {Studiodrawsenderrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawsenderrortoast4: ((
  inputs?: Studiodrawsenderrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawsenderrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawsenderrortoast4 as "studioDrawSendErrorToast" };
