/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auditlogcolumnaction3Inputs */

const vi_auditlogcolumnaction3 =
  /** @type {(inputs: Auditlogcolumnaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hành động`;
  };

const en_auditlogcolumnaction3 =
  /** @type {(inputs: Auditlogcolumnaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Action`;
  };

/**
 * | output |
 * | --- |
 * | "Action" |
 *
 * @param {Auditlogcolumnaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const auditlogcolumnaction3 =
  /** @type {((inputs?: Auditlogcolumnaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auditlogcolumnaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_auditlogcolumnaction3(inputs);
      return vi_auditlogcolumnaction3(inputs);
    }
  );
export { auditlogcolumnaction3 as "auditLogColumnAction" };
