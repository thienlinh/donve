export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsstatuspending2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Pending" |
 *
 * @param {Domainsstatuspending2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsstatuspending2: ((
  inputs?: Domainsstatuspending2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsstatuspending2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsstatuspending2 as "domainsStatusPending" };
