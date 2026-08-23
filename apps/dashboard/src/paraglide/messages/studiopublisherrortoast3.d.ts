export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublisherrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't publish. Try again." |
 *
 * @param {Studiopublisherrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublisherrortoast3: ((
  inputs?: Studiopublisherrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublisherrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublisherrortoast3 as "studioPublishErrorToast" };
