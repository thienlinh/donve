/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productscourseactivationlabel3Inputs */

const vi_productscourseactivationlabel3 =
  /** @type {(inputs: Productscourseactivationlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hướng dẫn kích hoạt`;
  };

const en_productscourseactivationlabel3 =
  /** @type {(inputs: Productscourseactivationlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Activation instructions`;
  };

/**
 * | output |
 * | --- |
 * | "Activation instructions" |
 *
 * @param {Productscourseactivationlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productscourseactivationlabel3 =
  /** @type {((inputs?: Productscourseactivationlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productscourseactivationlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productscourseactivationlabel3(inputs);
      return vi_productscourseactivationlabel3(inputs);
    }
  );
export { productscourseactivationlabel3 as "productsCourseActivationLabel" };
