/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingchecklistdismiss2Inputs */

const vi_onboardingchecklistdismiss2 =
  /** @type {(inputs: Onboardingchecklistdismiss2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ẩn danh sách này`;
  };

const en_onboardingchecklistdismiss2 =
  /** @type {(inputs: Onboardingchecklistdismiss2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dismiss checklist`;
  };

/**
 * | output |
 * | --- |
 * | "Dismiss checklist" |
 *
 * @param {Onboardingchecklistdismiss2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingchecklistdismiss2 =
  /** @type {((inputs?: Onboardingchecklistdismiss2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingchecklistdismiss2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingchecklistdismiss2(inputs);
      return vi_onboardingchecklistdismiss2(inputs);
    }
  );
export { onboardingchecklistdismiss2 as "onboardingChecklistDismiss" };
