/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingstepcreatelanding3Inputs */

const vi_onboardingstepcreatelanding3 =
  /** @type {(inputs: Onboardingstepcreatelanding3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo landing page đầu tiên`;
  };

const en_onboardingstepcreatelanding3 =
  /** @type {(inputs: Onboardingstepcreatelanding3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Create your first landing page`;
  };

/**
 * | output |
 * | --- |
 * | "Create your first landing page" |
 *
 * @param {Onboardingstepcreatelanding3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingstepcreatelanding3 =
  /** @type {((inputs?: Onboardingstepcreatelanding3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingstepcreatelanding3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingstepcreatelanding3(inputs);
      return vi_onboardingstepcreatelanding3(inputs);
    }
  );
export { onboardingstepcreatelanding3 as "onboardingStepCreateLanding" };
