/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Routenotfounddescription3Inputs */

const vi_routenotfounddescription3 =
  /** @type {(inputs: Routenotfounddescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trang bạn tìm không tồn tại hoặc đã được chuyển đi.`;
  };

const en_routenotfounddescription3 =
  /** @type {(inputs: Routenotfounddescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `The page you're looking for doesn't exist or was moved.`;
  };

/**
 * | output |
 * | --- |
 * | "The page you're looking for doesn't exist or was moved." |
 *
 * @param {Routenotfounddescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const routenotfounddescription3 =
  /** @type {((inputs?: Routenotfounddescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Routenotfounddescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_routenotfounddescription3(inputs);
      return vi_routenotfounddescription3(inputs);
    }
  );
export { routenotfounddescription3 as "routeNotFoundDescription" };
