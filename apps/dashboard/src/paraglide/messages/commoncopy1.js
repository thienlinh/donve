/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commoncopy1Inputs */

const vi_commoncopy1 =
  /** @type {(inputs: Commoncopy1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sao chép`;
  };

const en_commoncopy1 =
  /** @type {(inputs: Commoncopy1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Copy`;
  };

/**
 * | output |
 * | --- |
 * | "Copy" |
 *
 * @param {Commoncopy1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commoncopy1 =
  /** @type {((inputs?: Commoncopy1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commoncopy1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commoncopy1(inputs);
      return vi_commoncopy1(inputs);
    }
  );
export { commoncopy1 as "commonCopy" };
