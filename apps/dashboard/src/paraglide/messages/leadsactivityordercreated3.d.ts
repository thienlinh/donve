export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactivityordercreated3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Order created" |
 *
 * @param {Leadsactivityordercreated3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactivityordercreated3: ((
  inputs?: Leadsactivityordercreated3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactivityordercreated3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactivityordercreated3 as "leadsActivityOrderCreated" };
