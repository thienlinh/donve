/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Routeerrortitle2Inputs */

const vi_routeerrortitle2 =
  /** @type {(inputs: Routeerrortitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã xảy ra lỗi`;
  };

const en_routeerrortitle2 =
  /** @type {(inputs: Routeerrortitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Something went wrong`;
  };

/**
 * | output |
 * | --- |
 * | "Something went wrong" |
 *
 * @param {Routeerrortitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const routeerrortitle2 =
  /** @type {((inputs?: Routeerrortitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Routeerrortitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_routeerrortitle2(inputs);
      return vi_routeerrortitle2(inputs);
    }
  );
export { routeerrortitle2 as "routeErrorTitle" };
