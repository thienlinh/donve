/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofunnelgapstitle3Inputs */

const vi_studiofunnelgapstitle3 =
  /** @type {(inputs: Studiofunnelgapstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chuẩn hoá phễu`;
  };

const en_studiofunnelgapstitle3 =
  /** @type {(inputs: Studiofunnelgapstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Standardize the funnel`;
  };

/**
 * | output |
 * | --- |
 * | "Standardize the funnel" |
 *
 * @param {Studiofunnelgapstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofunnelgapstitle3 =
  /** @type {((inputs?: Studiofunnelgapstitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofunnelgapstitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofunnelgapstitle3(inputs);
      return vi_studiofunnelgapstitle3(inputs);
    }
  );
export { studiofunnelgapstitle3 as "studioFunnelGapsTitle" };
