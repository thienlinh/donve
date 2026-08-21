/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignscolumnactions2Inputs */

const vi_campaignscolumnactions2 =
  /** @type {(inputs: Campaignscolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hành động`;
  };

const en_campaignscolumnactions2 =
  /** @type {(inputs: Campaignscolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Actions`;
  };

/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Campaignscolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignscolumnactions2 =
  /** @type {((inputs?: Campaignscolumnactions2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignscolumnactions2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignscolumnactions2(inputs);
      return vi_campaignscolumnactions2(inputs);
    }
  );
export { campaignscolumnactions2 as "campaignsColumnActions" };
