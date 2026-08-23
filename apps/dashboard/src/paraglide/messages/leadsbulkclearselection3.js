/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkclearselection3Inputs */

const vi_leadsbulkclearselection3 =
  /** @type {(inputs: Leadsbulkclearselection3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bỏ chọn`;
  };

const en_leadsbulkclearselection3 =
  /** @type {(inputs: Leadsbulkclearselection3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Clear selection`;
  };

/**
 * | output |
 * | --- |
 * | "Clear selection" |
 *
 * @param {Leadsbulkclearselection3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkclearselection3 =
  /** @type {((inputs?: Leadsbulkclearselection3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkclearselection3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkclearselection3(inputs);
      return vi_leadsbulkclearselection3(inputs);
    }
  );
export { leadsbulkclearselection3 as "leadsBulkClearSelection" };
