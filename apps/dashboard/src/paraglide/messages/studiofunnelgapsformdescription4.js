/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofunnelgapsformdescription4Inputs */

const vi_studiofunnelgapsformdescription4 =
  /** @type {(inputs: Studiofunnelgapsformdescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trang import này chưa có form đăng ký chuẩn của nền tảng. Để AI gắn form giúp bạn?`;
  };

const en_studiofunnelgapsformdescription4 =
  /** @type {(inputs: Studiofunnelgapsformdescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `This imported page has no standard platform lead form. Let AI attach one?`;
  };

/**
 * | output |
 * | --- |
 * | "This imported page has no standard platform lead form. Let AI attach one?" |
 *
 * @param {Studiofunnelgapsformdescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofunnelgapsformdescription4 =
  /** @type {((inputs?: Studiofunnelgapsformdescription4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofunnelgapsformdescription4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofunnelgapsformdescription4(inputs);
      return vi_studiofunnelgapsformdescription4(inputs);
    }
  );
export { studiofunnelgapsformdescription4 as "studioFunnelGapsFormDescription" };
