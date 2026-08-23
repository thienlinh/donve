/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commonnext1Inputs */

const vi_commonnext1 =
  /** @type {(inputs: Commonnext1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sau`;
  };

const en_commonnext1 =
  /** @type {(inputs: Commonnext1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Next`;
  };

/**
 * | output |
 * | --- |
 * | "Next" |
 *
 * @param {Commonnext1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commonnext1 =
  /** @type {((inputs?: Commonnext1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commonnext1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commonnext1(inputs);
      return vi_commonnext1(inputs);
    }
  );
export { commonnext1 as "commonNext" };
