/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsleaddigestfrequencydescription4Inputs */

const vi_settingsleaddigestfrequencydescription4 =
  /** @type {(inputs: Settingsleaddigestfrequencydescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gộp lead mới thành một email cho người phụ trách/owner, thay vì gửi từng lead một.`;
  };

const en_settingsleaddigestfrequencydescription4 =
  /** @type {(inputs: Settingsleaddigestfrequencydescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Batch new leads into one email per assignee/owner instead of sending one email per lead.`;
  };

/**
 * | output |
 * | --- |
 * | "Batch new leads into one email per assignee/owner instead of sending one email per lead." |
 *
 * @param {Settingsleaddigestfrequencydescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsleaddigestfrequencydescription4 =
  /** @type {((inputs?: Settingsleaddigestfrequencydescription4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsleaddigestfrequencydescription4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_settingsleaddigestfrequencydescription4(inputs);
      return vi_settingsleaddigestfrequencydescription4(inputs);
    }
  );
export { settingsleaddigestfrequencydescription4 as "settingsLeadDigestFrequencyDescription" };
