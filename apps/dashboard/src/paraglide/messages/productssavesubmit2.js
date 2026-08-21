/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productssavesubmit2Inputs */

const vi_productssavesubmit2 =
  /** @type {(inputs: Productssavesubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu`;
  };

const en_productssavesubmit2 =
  /** @type {(inputs: Productssavesubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Save`;
  };

/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Productssavesubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productssavesubmit2 =
  /** @type {((inputs?: Productssavesubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productssavesubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productssavesubmit2(inputs);
      return vi_productssavesubmit2(inputs);
    }
  );
export { productssavesubmit2 as "productsSaveSubmit" };
