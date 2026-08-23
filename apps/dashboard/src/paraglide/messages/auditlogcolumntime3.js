/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auditlogcolumntime3Inputs */

const vi_auditlogcolumntime3 =
  /** @type {(inputs: Auditlogcolumntime3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thời gian`;
  };

const en_auditlogcolumntime3 =
  /** @type {(inputs: Auditlogcolumntime3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Time`;
  };

/**
 * | output |
 * | --- |
 * | "Time" |
 *
 * @param {Auditlogcolumntime3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const auditlogcolumntime3 =
  /** @type {((inputs?: Auditlogcolumntime3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auditlogcolumntime3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_auditlogcolumntime3(inputs);
      return vi_auditlogcolumntime3(inputs);
    }
  );
export { auditlogcolumntime3 as "auditLogColumnTime" };
