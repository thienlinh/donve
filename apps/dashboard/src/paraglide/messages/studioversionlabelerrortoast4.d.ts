export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionlabelerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't save the label. Try again." |
 *
 * @param {Studioversionlabelerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionlabelerrortoast4: ((
  inputs?: Studioversionlabelerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionlabelerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionlabelerrortoast4 as "studioVersionLabelErrorToast" };
