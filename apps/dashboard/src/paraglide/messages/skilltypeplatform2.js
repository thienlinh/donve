/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skilltypeplatform2Inputs */

const vi_skilltypeplatform2 =
  /** @type {(inputs: Skilltypeplatform2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nền tảng`;
  };

const en_skilltypeplatform2 =
  /** @type {(inputs: Skilltypeplatform2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Platform`;
  };

/**
 * | output |
 * | --- |
 * | "Platform" |
 *
 * @param {Skilltypeplatform2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skilltypeplatform2 =
  /** @type {((inputs?: Skilltypeplatform2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skilltypeplatform2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skilltypeplatform2(inputs);
      return vi_skilltypeplatform2(inputs);
    }
  );
export { skilltypeplatform2 as "skillTypePlatform" };
