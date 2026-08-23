/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofunnelgapsfixbutton4Inputs */

const vi_studiofunnelgapsfixbutton4 =
  /** @type {(inputs: Studiofunnelgapsfixbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Để AI chuẩn hoá`;
  };

const en_studiofunnelgapsfixbutton4 =
  /** @type {(inputs: Studiofunnelgapsfixbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Let AI standardize it`;
  };

/**
 * | output |
 * | --- |
 * | "Let AI standardize it" |
 *
 * @param {Studiofunnelgapsfixbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofunnelgapsfixbutton4 =
  /** @type {((inputs?: Studiofunnelgapsfixbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofunnelgapsfixbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofunnelgapsfixbutton4(inputs);
      return vi_studiofunnelgapsfixbutton4(inputs);
    }
  );
export { studiofunnelgapsfixbutton4 as "studioFunnelGapsFixButton" };
