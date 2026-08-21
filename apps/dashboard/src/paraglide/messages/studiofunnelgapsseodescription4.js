/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofunnelgapsseodescription4Inputs */

const vi_studiofunnelgapsseodescription4 =
  /** @type {(inputs: Studiofunnelgapsseodescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trang import này còn thiếu SEO meta (tiêu đề/mô tả). Để AI bổ sung giúp bạn?`;
  };

const en_studiofunnelgapsseodescription4 =
  /** @type {(inputs: Studiofunnelgapsseodescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `This imported page is missing SEO meta (title/description). Let AI fill it in?`;
  };

/**
 * | output |
 * | --- |
 * | "This imported page is missing SEO meta (title/description). Let AI fill it in?" |
 *
 * @param {Studiofunnelgapsseodescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofunnelgapsseodescription4 =
  /** @type {((inputs?: Studiofunnelgapsseodescription4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofunnelgapsseodescription4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofunnelgapsseodescription4(inputs);
      return vi_studiofunnelgapsseodescription4(inputs);
    }
  );
export { studiofunnelgapsseodescription4 as "studioFunnelGapsSeoDescription" };
