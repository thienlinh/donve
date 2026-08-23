/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auditlogtitle2Inputs */

const vi_auditlogtitle2 =
  /** @type {(inputs: Auditlogtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhật ký hoạt động`;
  };

const en_auditlogtitle2 =
  /** @type {(inputs: Auditlogtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Audit log`;
  };

/**
 * | output |
 * | --- |
 * | "Audit log" |
 *
 * @param {Auditlogtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const auditlogtitle2 =
  /** @type {((inputs?: Auditlogtitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auditlogtitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_auditlogtitle2(inputs);
      return vi_auditlogtitle2(inputs);
    }
  );
export { auditlogtitle2 as "auditLogTitle" };
