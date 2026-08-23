/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auditlogcolumntarget3Inputs */

const vi_auditlogcolumntarget3 =
  /** @type {(inputs: Auditlogcolumntarget3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đối tượng`;
  };

const en_auditlogcolumntarget3 =
  /** @type {(inputs: Auditlogcolumntarget3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Target`;
  };

/**
 * | output |
 * | --- |
 * | "Target" |
 *
 * @param {Auditlogcolumntarget3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const auditlogcolumntarget3 =
  /** @type {((inputs?: Auditlogcolumntarget3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auditlogcolumntarget3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_auditlogcolumntarget3(inputs);
      return vi_auditlogcolumntarget3(inputs);
    }
  );
export { auditlogcolumntarget3 as "auditLogColumnTarget" };
