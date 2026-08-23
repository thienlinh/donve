/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyphonelabel3Inputs */

const vi_leadsnotifyphonelabel3 =
  /** @type {(inputs: Leadsnotifyphonelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số điện thoại quản lý`;
  };

const en_leadsnotifyphonelabel3 =
  /** @type {(inputs: Leadsnotifyphonelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Manager phone number`;
  };

/**
 * | output |
 * | --- |
 * | "Manager phone number" |
 *
 * @param {Leadsnotifyphonelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyphonelabel3 =
  /** @type {((inputs?: Leadsnotifyphonelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyphonelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyphonelabel3(inputs);
      return vi_leadsnotifyphonelabel3(inputs);
    }
  );
export { leadsnotifyphonelabel3 as "leadsNotifyPhoneLabel" };
