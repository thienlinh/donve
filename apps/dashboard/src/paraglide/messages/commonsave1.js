/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commonsave1Inputs */

const vi_commonsave1 =
  /** @type {(inputs: Commonsave1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu`;
  };

const en_commonsave1 =
  /** @type {(inputs: Commonsave1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Save`;
  };

/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Commonsave1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commonsave1 =
  /** @type {((inputs?: Commonsave1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commonsave1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commonsave1(inputs);
      return vi_commonsave1(inputs);
    }
  );
export { commonsave1 as "commonSave" };
