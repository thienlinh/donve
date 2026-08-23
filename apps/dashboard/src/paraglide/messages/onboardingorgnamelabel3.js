/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingorgnamelabel3Inputs */

const vi_onboardingorgnamelabel3 =
  /** @type {(inputs: Onboardingorgnamelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên tổ chức`;
  };

const en_onboardingorgnamelabel3 =
  /** @type {(inputs: Onboardingorgnamelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Organization name`;
  };

/**
 * | output |
 * | --- |
 * | "Organization name" |
 *
 * @param {Onboardingorgnamelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingorgnamelabel3 =
  /** @type {((inputs?: Onboardingorgnamelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingorgnamelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingorgnamelabel3(inputs);
      return vi_onboardingorgnamelabel3(inputs);
    }
  );
export { onboardingorgnamelabel3 as "onboardingOrgNameLabel" };
