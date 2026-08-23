/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiotoolbartweaks2Inputs */

const vi_studiotoolbartweaks2 =
  /** @type {(inputs: Studiotoolbartweaks2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tweaks`;
  };

const en_studiotoolbartweaks2 =
  /** @type {(inputs: Studiotoolbartweaks2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tweaks`;
  };

/**
 * | output |
 * | --- |
 * | "Tweaks" |
 *
 * @param {Studiotoolbartweaks2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiotoolbartweaks2 =
  /** @type {((inputs?: Studiotoolbartweaks2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiotoolbartweaks2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiotoolbartweaks2(inputs);
      return vi_studiotoolbartweaks2(inputs);
    }
  );
export { studiotoolbartweaks2 as "studioToolbarTweaks" };
