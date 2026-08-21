/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auditlogloaderrortitle4Inputs */

const vi_auditlogloaderrortitle4 =
  /** @type {(inputs: Auditlogloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được nhật ký hoạt động`;
  };

const en_auditlogloaderrortitle4 =
  /** @type {(inputs: Auditlogloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to load audit log`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to load audit log" |
 *
 * @param {Auditlogloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const auditlogloaderrortitle4 =
  /** @type {((inputs?: Auditlogloaderrortitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auditlogloaderrortitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_auditlogloaderrortitle4(inputs);
      return vi_auditlogloaderrortitle4(inputs);
    }
  );
export { auditlogloaderrortitle4 as "auditLogLoadErrorTitle" };
