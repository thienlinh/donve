/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commoncancel1Inputs */

const vi_commoncancel1 =
  /** @type {(inputs: Commoncancel1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hủy`;
  };

const en_commoncancel1 =
  /** @type {(inputs: Commoncancel1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cancel`;
  };

/**
 * | output |
 * | --- |
 * | "Cancel" |
 *
 * @param {Commoncancel1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commoncancel1 =
  /** @type {((inputs?: Commoncancel1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commoncancel1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commoncancel1(inputs);
      return vi_commoncancel1(inputs);
    }
  );
export { commoncancel1 as "commonCancel" };
