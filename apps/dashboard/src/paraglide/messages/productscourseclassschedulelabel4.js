/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productscourseclassschedulelabel4Inputs */

const vi_productscourseclassschedulelabel4 =
  /** @type {(inputs: Productscourseclassschedulelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lịch học`;
  };

const en_productscourseclassschedulelabel4 =
  /** @type {(inputs: Productscourseclassschedulelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Class schedule`;
  };

/**
 * | output |
 * | --- |
 * | "Class schedule" |
 *
 * @param {Productscourseclassschedulelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productscourseclassschedulelabel4 =
  /** @type {((inputs?: Productscourseclassschedulelabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productscourseclassschedulelabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productscourseclassschedulelabel4(inputs);
      return vi_productscourseclassschedulelabel4(inputs);
    }
  );
export { productscourseclassschedulelabel4 as "productsCourseClassScheduleLabel" };
