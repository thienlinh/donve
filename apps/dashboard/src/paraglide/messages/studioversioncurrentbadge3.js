/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversioncurrentbadge3Inputs */

const vi_studioversioncurrentbadge3 =
  /** @type {(inputs: Studioversioncurrentbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hiện tại`;
  };

const en_studioversioncurrentbadge3 =
  /** @type {(inputs: Studioversioncurrentbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Current`;
  };

/**
 * | output |
 * | --- |
 * | "Current" |
 *
 * @param {Studioversioncurrentbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversioncurrentbadge3 =
  /** @type {((inputs?: Studioversioncurrentbadge3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversioncurrentbadge3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversioncurrentbadge3(inputs);
      return vi_studioversioncurrentbadge3(inputs);
    }
  );
export { studioversioncurrentbadge3 as "studioVersionCurrentBadge" };
