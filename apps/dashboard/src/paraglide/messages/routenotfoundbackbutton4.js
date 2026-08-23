/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Routenotfoundbackbutton4Inputs */

const vi_routenotfoundbackbutton4 =
  /** @type {(inputs: Routenotfoundbackbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Về trang chủ`;
  };

const en_routenotfoundbackbutton4 =
  /** @type {(inputs: Routenotfoundbackbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Back to home`;
  };

/**
 * | output |
 * | --- |
 * | "Back to home" |
 *
 * @param {Routenotfoundbackbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const routenotfoundbackbutton4 =
  /** @type {((inputs?: Routenotfoundbackbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Routenotfoundbackbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_routenotfoundbackbutton4(inputs);
      return vi_routenotfoundbackbutton4(inputs);
    }
  );
export { routenotfoundbackbutton4 as "routeNotFoundBackButton" };
