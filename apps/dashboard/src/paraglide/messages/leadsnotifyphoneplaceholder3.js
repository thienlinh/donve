/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyphoneplaceholder3Inputs */

const vi_leadsnotifyphoneplaceholder3 =
  /** @type {(inputs: Leadsnotifyphoneplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `vd: 0912345678`;
  };

const en_leadsnotifyphoneplaceholder3 =
  /** @type {(inputs: Leadsnotifyphoneplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `e.g. 0912345678`;
  };

/**
 * | output |
 * | --- |
 * | "e.g. 0912345678" |
 *
 * @param {Leadsnotifyphoneplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyphoneplaceholder3 =
  /** @type {((inputs?: Leadsnotifyphoneplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyphoneplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyphoneplaceholder3(inputs);
      return vi_leadsnotifyphoneplaceholder3(inputs);
    }
  );
export { leadsnotifyphoneplaceholder3 as "leadsNotifyPhonePlaceholder" };
