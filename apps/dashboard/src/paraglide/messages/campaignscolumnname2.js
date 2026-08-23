/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignscolumnname2Inputs */

const vi_campaignscolumnname2 =
  /** @type {(inputs: Campaignscolumnname2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên`;
  };

const en_campaignscolumnname2 =
  /** @type {(inputs: Campaignscolumnname2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Name`;
  };

/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Campaignscolumnname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignscolumnname2 =
  /** @type {((inputs?: Campaignscolumnname2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignscolumnname2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignscolumnname2(inputs);
      return vi_campaignscolumnname2(inputs);
    }
  );
export { campaignscolumnname2 as "campaignsColumnName" };
