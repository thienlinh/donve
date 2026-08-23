/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Routenotfoundtitle3Inputs */

const vi_routenotfoundtitle3 =
  /** @type {(inputs: Routenotfoundtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tìm thấy trang`;
  };

const en_routenotfoundtitle3 =
  /** @type {(inputs: Routenotfoundtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Page not found`;
  };

/**
 * | output |
 * | --- |
 * | "Page not found" |
 *
 * @param {Routenotfoundtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const routenotfoundtitle3 =
  /** @type {((inputs?: Routenotfoundtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Routenotfoundtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_routenotfoundtitle3(inputs);
      return vi_routenotfoundtitle3(inputs);
    }
  );
export { routenotfoundtitle3 as "routeNotFoundTitle" };
