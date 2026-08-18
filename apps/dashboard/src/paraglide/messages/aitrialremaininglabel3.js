/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aitrialremaininglabel3Inputs */

const vi_aitrialremaininglabel3 =
  /** @type {(inputs: Aitrialremaininglabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số lần dùng thử miễn phí còn lại`;
  };

const en_aitrialremaininglabel3 =
  /** @type {(inputs: Aitrialremaininglabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Free trial uses left`;
  };

/**
 * | output |
 * | --- |
 * | "Free trial uses left" |
 *
 * @param {Aitrialremaininglabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aitrialremaininglabel3 =
  /** @type {((inputs?: Aitrialremaininglabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aitrialremaininglabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aitrialremaininglabel3(inputs);
      return vi_aitrialremaininglabel3(inputs);
    }
  );
export { aitrialremaininglabel3 as "aiTrialRemainingLabel" };
