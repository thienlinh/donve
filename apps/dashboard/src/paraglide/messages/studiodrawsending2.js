/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawsending2Inputs */

const vi_studiodrawsending2 =
  /** @type {(inputs: Studiodrawsending2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang gửi…`;
  };

const en_studiodrawsending2 =
  /** @type {(inputs: Studiodrawsending2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sending…`;
  };

/**
 * | output |
 * | --- |
 * | "Sending…" |
 *
 * @param {Studiodrawsending2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawsending2 =
  /** @type {((inputs?: Studiodrawsending2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawsending2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawsending2(inputs);
      return vi_studiodrawsending2(inputs);
    }
  );
export { studiodrawsending2 as "studioDrawSending" };
