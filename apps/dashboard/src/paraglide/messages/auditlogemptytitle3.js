/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auditlogemptytitle3Inputs */

const vi_auditlogemptytitle3 =
  /** @type {(inputs: Auditlogemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có nhật ký hoạt động nào`;
  };

const en_auditlogemptytitle3 =
  /** @type {(inputs: Auditlogemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No audit log entries yet`;
  };

/**
 * | output |
 * | --- |
 * | "No audit log entries yet" |
 *
 * @param {Auditlogemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const auditlogemptytitle3 =
  /** @type {((inputs?: Auditlogemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auditlogemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_auditlogemptytitle3(inputs);
      return vi_auditlogemptytitle3(inputs);
    }
  );
export { auditlogemptytitle3 as "auditLogEmptyTitle" };
