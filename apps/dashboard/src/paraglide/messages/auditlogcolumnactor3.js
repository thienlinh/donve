/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auditlogcolumnactor3Inputs */

const vi_auditlogcolumnactor3 =
  /** @type {(inputs: Auditlogcolumnactor3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Người thực hiện`;
  };

const en_auditlogcolumnactor3 =
  /** @type {(inputs: Auditlogcolumnactor3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Actor`;
  };

/**
 * | output |
 * | --- |
 * | "Actor" |
 *
 * @param {Auditlogcolumnactor3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const auditlogcolumnactor3 =
  /** @type {((inputs?: Auditlogcolumnactor3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auditlogcolumnactor3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_auditlogcolumnactor3(inputs);
      return vi_auditlogcolumnactor3(inputs);
    }
  );
export { auditlogcolumnactor3 as "auditLogColumnActor" };
