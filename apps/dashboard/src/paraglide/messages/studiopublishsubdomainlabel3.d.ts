export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishsubdomainlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Subdomain" |
 *
 * @param {Studiopublishsubdomainlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishsubdomainlabel3: ((
  inputs?: Studiopublishsubdomainlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishsubdomainlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishsubdomainlabel3 as "studioPublishSubdomainLabel" };
