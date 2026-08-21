/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiogenerateerrorinsufficientcreditsdescription5Inputs */

const vi_studiogenerateerrorinsufficientcreditsdescription5 =
  /** @type {(inputs: Studiogenerateerrorinsufficientcreditsdescription5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nạp thêm credit để tiếp tục tạo trang.`;
  };

const en_studiogenerateerrorinsufficientcreditsdescription5 =
  /** @type {(inputs: Studiogenerateerrorinsufficientcreditsdescription5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Top up your credit balance to keep generating.`;
  };

/**
 * | output |
 * | --- |
 * | "Top up your credit balance to keep generating." |
 *
 * @param {Studiogenerateerrorinsufficientcreditsdescription5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiogenerateerrorinsufficientcreditsdescription5 =
  /** @type {((inputs?: Studiogenerateerrorinsufficientcreditsdescription5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiogenerateerrorinsufficientcreditsdescription5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiogenerateerrorinsufficientcreditsdescription5(inputs);
      return vi_studiogenerateerrorinsufficientcreditsdescription5(inputs);
    }
  );
export { studiogenerateerrorinsufficientcreditsdescription5 as "studioGenerateErrorInsufficientCreditsDescription" };
