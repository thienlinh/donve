/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofunnelgapsbothdescription4Inputs */

const vi_studiofunnelgapsbothdescription4 =
  /** @type {(inputs: Studiofunnelgapsbothdescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trang import này chưa có form đăng ký chuẩn và còn thiếu SEO meta. Để AI bổ sung giúp bạn?`;
  };

const en_studiofunnelgapsbothdescription4 =
  /** @type {(inputs: Studiofunnelgapsbothdescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `This imported page has no standard lead form and is missing SEO meta. Let AI add them?`;
  };

/**
 * | output |
 * | --- |
 * | "This imported page has no standard lead form and is missing SEO meta. Let AI add them?" |
 *
 * @param {Studiofunnelgapsbothdescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofunnelgapsbothdescription4 =
  /** @type {((inputs?: Studiofunnelgapsbothdescription4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofunnelgapsbothdescription4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofunnelgapsbothdescription4(inputs);
      return vi_studiofunnelgapsbothdescription4(inputs);
    }
  );
export { studiofunnelgapsbothdescription4 as "studioFunnelGapsBothDescription" };
