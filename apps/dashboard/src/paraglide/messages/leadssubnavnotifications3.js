/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssubnavnotifications3Inputs */

const vi_leadssubnavnotifications3 =
  /** @type {(inputs: Leadssubnavnotifications3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thông báo`;
  };

const en_leadssubnavnotifications3 =
  /** @type {(inputs: Leadssubnavnotifications3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Notifications`;
  };

/**
 * | output |
 * | --- |
 * | "Notifications" |
 *
 * @param {Leadssubnavnotifications3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssubnavnotifications3 =
  /** @type {((inputs?: Leadssubnavnotifications3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssubnavnotifications3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssubnavnotifications3(inputs);
      return vi_leadssubnavnotifications3(inputs);
    }
  );
export { leadssubnavnotifications3 as "leadsSubNavNotifications" };
