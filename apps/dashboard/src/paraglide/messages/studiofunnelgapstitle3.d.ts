export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofunnelgapstitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Standardize the funnel" |
 *
 * @param {Studiofunnelgapstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofunnelgapstitle3: ((
  inputs?: Studiofunnelgapstitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofunnelgapstitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofunnelgapstitle3 as "studioFunnelGapsTitle" };
