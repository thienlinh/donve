/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofunnelgapsdismiss3Inputs */

const vi_studiofunnelgapsdismiss3 =
  /** @type {(inputs: Studiofunnelgapsdismiss3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bỏ qua`;
  };

const en_studiofunnelgapsdismiss3 =
  /** @type {(inputs: Studiofunnelgapsdismiss3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dismiss`;
  };

/**
 * | output |
 * | --- |
 * | "Dismiss" |
 *
 * @param {Studiofunnelgapsdismiss3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofunnelgapsdismiss3 =
  /** @type {((inputs?: Studiofunnelgapsdismiss3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofunnelgapsdismiss3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofunnelgapsdismiss3(inputs);
      return vi_studiofunnelgapsdismiss3(inputs);
    }
  );
export { studiofunnelgapsdismiss3 as "studioFunnelGapsDismiss" };
