/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsnamelabel2Inputs */

const vi_campaignsnamelabel2 =
  /** @type {(inputs: Campaignsnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên`;
  };

const en_campaignsnamelabel2 =
  /** @type {(inputs: Campaignsnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Name`;
  };

/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Campaignsnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsnamelabel2 =
  /** @type {((inputs?: Campaignsnamelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsnamelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsnamelabel2(inputs);
      return vi_campaignsnamelabel2(inputs);
    }
  );
export { campaignsnamelabel2 as "campaignsNameLabel" };
