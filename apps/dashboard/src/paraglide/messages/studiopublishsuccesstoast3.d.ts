export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishsuccesstoast3Inputs = {
  hostname: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Published at {hostname}" |
 *
 * @param {Studiopublishsuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishsuccesstoast3: ((
  inputs: Studiopublishsuccesstoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishsuccesstoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishsuccesstoast3 as "studioPublishSuccessToast" };
