export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadstotalpaidlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Total paid" |
 *
 * @param {Leadstotalpaidlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadstotalpaidlabel3: ((
  inputs?: Leadstotalpaidlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadstotalpaidlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadstotalpaidlabel3 as "leadsTotalPaidLabel" };
