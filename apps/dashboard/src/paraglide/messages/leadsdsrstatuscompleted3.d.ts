export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrstatuscompleted3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Completed" |
 *
 * @param {Leadsdsrstatuscompleted3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrstatuscompleted3: ((
  inputs?: Leadsdsrstatuscompleted3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrstatuscompleted3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrstatuscompleted3 as "leadsDsrStatusCompleted" };
