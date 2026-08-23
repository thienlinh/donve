/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingchecklisttitle2Inputs */

const vi_onboardingchecklisttitle2 =
  /** @type {(inputs: Onboardingchecklisttitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bắt đầu nhanh`;
  };

const en_onboardingchecklisttitle2 =
  /** @type {(inputs: Onboardingchecklisttitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Get started`;
  };

/**
 * | output |
 * | --- |
 * | "Get started" |
 *
 * @param {Onboardingchecklisttitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingchecklisttitle2 =
  /** @type {((inputs?: Onboardingchecklisttitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingchecklisttitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingchecklisttitle2(inputs);
      return vi_onboardingchecklisttitle2(inputs);
    }
  );
export { onboardingchecklisttitle2 as "onboardingChecklistTitle" };
