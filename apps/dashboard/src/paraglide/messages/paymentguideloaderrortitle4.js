/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentguideloaderrortitle4Inputs */

const vi_paymentguideloaderrortitle4 =
  /** @type {(inputs: Paymentguideloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được hướng dẫn`;
  };

const en_paymentguideloaderrortitle4 =
  /** @type {(inputs: Paymentguideloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load the guide`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load the guide" |
 *
 * @param {Paymentguideloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentguideloaderrortitle4 =
  /** @type {((inputs?: Paymentguideloaderrortitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentguideloaderrortitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentguideloaderrortitle4(inputs);
      return vi_paymentguideloaderrortitle4(inputs);
    }
  );
export { paymentguideloaderrortitle4 as "paymentGuideLoadErrorTitle" };
