/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingspromptheading2Inputs */

const vi_landingspromptheading2 =
  /** @type {(inputs: Landingspromptheading2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bạn muốn tạo landing gì?`;
  };

const en_landingspromptheading2 =
  /** @type {(inputs: Landingspromptheading2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `What landing page do you want to create?`;
  };

/**
 * | output |
 * | --- |
 * | "What landing page do you want to create?" |
 *
 * @param {Landingspromptheading2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingspromptheading2 =
  /** @type {((inputs?: Landingspromptheading2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingspromptheading2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingspromptheading2(inputs);
      return vi_landingspromptheading2(inputs);
    }
  );
export { landingspromptheading2 as "landingsPromptHeading" };
