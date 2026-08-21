/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commonloadmore2Inputs */

const vi_commonloadmore2 =
  /** @type {(inputs: Commonloadmore2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tải thêm`;
  };

const en_commonloadmore2 =
  /** @type {(inputs: Commonloadmore2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Load more`;
  };

/**
 * | output |
 * | --- |
 * | "Load more" |
 *
 * @param {Commonloadmore2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commonloadmore2 =
  /** @type {((inputs?: Commonloadmore2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commonloadmore2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commonloadmore2(inputs);
      return vi_commonloadmore2(inputs);
    }
  );
export { commonloadmore2 as "commonLoadMore" };
