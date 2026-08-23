/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Leadsnotificationsbelllabel3Inputs */

const vi_leadsnotificationsbelllabel3 =
  /** @type {(inputs: Leadsnotificationsbelllabel3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Thông báo lead (${i?.count} chưa đọc)`;
  };

const en_leadsnotificationsbelllabel3 =
  /** @type {(inputs: Leadsnotificationsbelllabel3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Lead notifications (${i?.count} unread)`;
  };

/**
 * | output |
 * | --- |
 * | "Lead notifications ({count} unread)" |
 *
 * @param {Leadsnotificationsbelllabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotificationsbelllabel3 =
  /** @type {((inputs: Leadsnotificationsbelllabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotificationsbelllabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotificationsbelllabel3(inputs);
      return vi_leadsnotificationsbelllabel3(inputs);
    }
  );
export { leadsnotificationsbelllabel3 as "leadsNotificationsBellLabel" };
