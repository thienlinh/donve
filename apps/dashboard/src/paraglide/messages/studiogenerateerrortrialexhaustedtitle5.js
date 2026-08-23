/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiogenerateerrortrialexhaustedtitle5Inputs */

const vi_studiogenerateerrortrialexhaustedtitle5 =
  /** @type {(inputs: Studiogenerateerrortrialexhaustedtitle5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã dùng hết lượt dùng thử`;
  };

const en_studiogenerateerrortrialexhaustedtitle5 =
  /** @type {(inputs: Studiogenerateerrortrialexhaustedtitle5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Free trial used up`;
  };

/**
 * | output |
 * | --- |
 * | "Free trial used up" |
 *
 * @param {Studiogenerateerrortrialexhaustedtitle5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiogenerateerrortrialexhaustedtitle5 =
  /** @type {((inputs?: Studiogenerateerrortrialexhaustedtitle5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiogenerateerrortrialexhaustedtitle5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiogenerateerrortrialexhaustedtitle5(inputs);
      return vi_studiogenerateerrortrialexhaustedtitle5(inputs);
    }
  );
export { studiogenerateerrortrialexhaustedtitle5 as "studioGenerateErrorTrialExhaustedTitle" };
