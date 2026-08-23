/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Routeerrordescription2Inputs */

const vi_routeerrordescription2 =
  /** @type {(inputs: Routeerrordescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được trang này. Vui lòng thử lại hoặc quay lại.`;
  };

const en_routeerrordescription2 =
  /** @type {(inputs: Routeerrordescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `This page couldn't be loaded. Try again or go back.`;
  };

/**
 * | output |
 * | --- |
 * | "This page couldn't be loaded. Try again or go back." |
 *
 * @param {Routeerrordescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const routeerrordescription2 =
  /** @type {((inputs?: Routeerrordescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Routeerrordescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_routeerrordescription2(inputs);
      return vi_routeerrordescription2(inputs);
    }
  );
export { routeerrordescription2 as "routeErrorDescription" };
