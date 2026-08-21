/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiogenerateerrortrialexhausteddescription5Inputs */

const vi_studiogenerateerrortrialexhausteddescription5 =
  /** @type {(inputs: Studiogenerateerrortrialexhausteddescription5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối API key riêng của bạn để tiếp tục tạo trang.`;
  };

const en_studiogenerateerrortrialexhausteddescription5 =
  /** @type {(inputs: Studiogenerateerrortrialexhausteddescription5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect your own API key to keep generating.`;
  };

/**
 * | output |
 * | --- |
 * | "Connect your own API key to keep generating." |
 *
 * @param {Studiogenerateerrortrialexhausteddescription5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiogenerateerrortrialexhausteddescription5 =
  /** @type {((inputs?: Studiogenerateerrortrialexhausteddescription5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiogenerateerrortrialexhausteddescription5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiogenerateerrortrialexhausteddescription5(inputs);
      return vi_studiogenerateerrortrialexhausteddescription5(inputs);
    }
  );
export { studiogenerateerrortrialexhausteddescription5 as "studioGenerateErrorTrialExhaustedDescription" };
