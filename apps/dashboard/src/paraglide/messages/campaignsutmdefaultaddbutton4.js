/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsutmdefaultaddbutton4Inputs */

const vi_campaignsutmdefaultaddbutton4 =
  /** @type {(inputs: Campaignsutmdefaultaddbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm tham số`;
  };

const en_campaignsutmdefaultaddbutton4 =
  /** @type {(inputs: Campaignsutmdefaultaddbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add parameter`;
  };

/**
 * | output |
 * | --- |
 * | "Add parameter" |
 *
 * @param {Campaignsutmdefaultaddbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsutmdefaultaddbutton4 =
  /** @type {((inputs?: Campaignsutmdefaultaddbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsutmdefaultaddbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsutmdefaultaddbutton4(inputs);
      return vi_campaignsutmdefaultaddbutton4(inputs);
    }
  );
export { campaignsutmdefaultaddbutton4 as "campaignsUtmDefaultAddButton" };
