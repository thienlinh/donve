export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsorderreasontitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Reason for status change" |
 *
 * @param {Leadsorderreasontitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsorderreasontitle3: ((
  inputs?: Leadsorderreasontitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsorderreasontitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsorderreasontitle3 as "leadsOrderReasonTitle" };
