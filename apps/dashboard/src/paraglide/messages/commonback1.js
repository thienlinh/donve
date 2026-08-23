/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commonback1Inputs */

const vi_commonback1 =
  /** @type {(inputs: Commonback1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quay lại`;
  };

const en_commonback1 =
  /** @type {(inputs: Commonback1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Back`;
  };

/**
 * | output |
 * | --- |
 * | "Back" |
 *
 * @param {Commonback1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commonback1 =
  /** @type {((inputs?: Commonback1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commonback1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commonback1(inputs);
      return vi_commonback1(inputs);
    }
  );
export { commonback1 as "commonBack" };
