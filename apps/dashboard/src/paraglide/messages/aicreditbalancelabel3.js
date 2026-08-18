/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aicreditbalancelabel3Inputs */

const vi_aicreditbalancelabel3 =
  /** @type {(inputs: Aicreditbalancelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số dư credit`;
  };

const en_aicreditbalancelabel3 =
  /** @type {(inputs: Aicreditbalancelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Credit balance`;
  };

/**
 * | output |
 * | --- |
 * | "Credit balance" |
 *
 * @param {Aicreditbalancelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aicreditbalancelabel3 =
  /** @type {((inputs?: Aicreditbalancelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aicreditbalancelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aicreditbalancelabel3(inputs);
      return vi_aicreditbalancelabel3(inputs);
    }
  );
export { aicreditbalancelabel3 as "aiCreditBalanceLabel" };
