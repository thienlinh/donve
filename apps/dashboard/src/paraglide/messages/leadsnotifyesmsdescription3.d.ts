export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyesmsdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Your own eSMS.vn account — paste the API key and secret key from your eSMS dashboard." |
 *
 * @param {Leadsnotifyesmsdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyesmsdescription3: ((
  inputs?: Leadsnotifyesmsdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyesmsdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyesmsdescription3 as "leadsNotifyEsmsDescription" };
