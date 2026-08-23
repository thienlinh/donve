export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyphonelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Manager phone number" |
 *
 * @param {Leadsnotifyphonelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyphonelabel3: ((
  inputs?: Leadsnotifyphonelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyphonelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyphonelabel3 as "leadsNotifyPhoneLabel" };
