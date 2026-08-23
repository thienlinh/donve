/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectioncolumnactions3Inputs */

const vi_paymentconnectioncolumnactions3 =
  /** @type {(inputs: Paymentconnectioncolumnactions3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hành động`;
  };

const en_paymentconnectioncolumnactions3 =
  /** @type {(inputs: Paymentconnectioncolumnactions3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Actions`;
  };

/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Paymentconnectioncolumnactions3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectioncolumnactions3 =
  /** @type {((inputs?: Paymentconnectioncolumnactions3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectioncolumnactions3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectioncolumnactions3(inputs);
      return vi_paymentconnectioncolumnactions3(inputs);
    }
  );
export { paymentconnectioncolumnactions3 as "paymentConnectionColumnActions" };
