/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsaddbutton2Inputs */

const vi_campaignsaddbutton2 =
  /** @type {(inputs: Campaignsaddbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm chiến dịch`;
  };

const en_campaignsaddbutton2 =
  /** @type {(inputs: Campaignsaddbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Add campaign" |
 *
 * @param {Campaignsaddbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsaddbutton2 =
  /** @type {((inputs?: Campaignsaddbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsaddbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsaddbutton2(inputs);
      return vi_campaignsaddbutton2(inputs);
    }
  );
export { campaignsaddbutton2 as "campaignsAddButton" };
