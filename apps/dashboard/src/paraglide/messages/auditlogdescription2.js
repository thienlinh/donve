/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auditlogdescription2Inputs */

const vi_auditlogdescription2 =
  /** @type {(inputs: Auditlogdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `200 hành động ghi gần nhất trong tổ chức (publish, đổi trạng thái đơn, hoàn tiền...).`;
  };

const en_auditlogdescription2 =
  /** @type {(inputs: Auditlogdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Most recent 200 write actions across this organization (publish, order status changes, refunds...).`;
  };

/**
 * | output |
 * | --- |
 * | "Most recent 200 write actions across this organization (publish, order status changes, refunds...)." |
 *
 * @param {Auditlogdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const auditlogdescription2 =
  /** @type {((inputs?: Auditlogdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auditlogdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_auditlogdescription2(inputs);
      return vi_auditlogdescription2(inputs);
    }
  );
export { auditlogdescription2 as "auditLogDescription" };
