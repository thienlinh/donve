/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookremovedtoast3Inputs */

const vi_leadswebhookremovedtoast3 =
  /** @type {(inputs: Leadswebhookremovedtoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã gỡ, org này dùng lại secret chung`;
  };

const en_leadswebhookremovedtoast3 =
  /** @type {(inputs: Leadswebhookremovedtoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Removed — this org now uses the shared secret`;
  };

/**
 * | output |
 * | --- |
 * | "Removed — this org now uses the shared secret" |
 *
 * @param {Leadswebhookremovedtoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookremovedtoast3 =
  /** @type {((inputs?: Leadswebhookremovedtoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookremovedtoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookremovedtoast3(inputs);
      return vi_leadswebhookremovedtoast3(inputs);
    }
  );
export { leadswebhookremovedtoast3 as "leadsWebhookRemovedToast" };
