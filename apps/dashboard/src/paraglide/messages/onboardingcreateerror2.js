/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingcreateerror2Inputs */

const vi_onboardingcreateerror2 =
  /** @type {(inputs: Onboardingcreateerror2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tạo được tổ chức. Vui lòng thử lại.`;
  };

const en_onboardingcreateerror2 =
  /** @type {(inputs: Onboardingcreateerror2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't create your organization. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't create your organization. Try again." |
 *
 * @param {Onboardingcreateerror2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingcreateerror2 =
  /** @type {((inputs?: Onboardingcreateerror2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingcreateerror2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingcreateerror2(inputs);
      return vi_onboardingcreateerror2(inputs);
    }
  );
export { onboardingcreateerror2 as "onboardingCreateError" };
