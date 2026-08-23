/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesjsonviewerempty4Inputs */

const vi_studiofilesjsonviewerempty4 =
  /** @type {(inputs: Studiofilesjsonviewerempty4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có dữ liệu srcmap.`;
  };

const en_studiofilesjsonviewerempty4 =
  /** @type {(inputs: Studiofilesjsonviewerempty4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No srcmap data yet.`;
  };

/**
 * | output |
 * | --- |
 * | "No srcmap data yet." |
 *
 * @param {Studiofilesjsonviewerempty4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesjsonviewerempty4 =
  /** @type {((inputs?: Studiofilesjsonviewerempty4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesjsonviewerempty4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesjsonviewerempty4(inputs);
      return vi_studiofilesjsonviewerempty4(inputs);
    }
  );
export { studiofilesjsonviewerempty4 as "studioFilesJsonViewerEmpty" };
