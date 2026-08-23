export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofunnelgapsdismiss3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Dismiss" |
 *
 * @param {Studiofunnelgapsdismiss3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofunnelgapsdismiss3: ((
  inputs?: Studiofunnelgapsdismiss3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofunnelgapsdismiss3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofunnelgapsdismiss3 as "studioFunnelGapsDismiss" };
