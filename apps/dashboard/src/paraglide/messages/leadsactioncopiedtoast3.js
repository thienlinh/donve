/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactioncopiedtoast3Inputs */

const vi_leadsactioncopiedtoast3 =
  /** @type {(inputs: Leadsactioncopiedtoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã copy số điện thoại`;
  };

const en_leadsactioncopiedtoast3 =
  /** @type {(inputs: Leadsactioncopiedtoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Phone number copied`;
  };

/**
 * | output |
 * | --- |
 * | "Phone number copied" |
 *
 * @param {Leadsactioncopiedtoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactioncopiedtoast3 =
  /** @type {((inputs?: Leadsactioncopiedtoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactioncopiedtoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactioncopiedtoast3(inputs);
      return vi_leadsactioncopiedtoast3(inputs);
    }
  );
export { leadsactioncopiedtoast3 as "leadsActionCopiedToast" };
