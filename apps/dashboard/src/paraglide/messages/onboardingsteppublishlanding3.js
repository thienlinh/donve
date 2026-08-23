/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingsteppublishlanding3Inputs */

const vi_onboardingsteppublishlanding3 =
  /** @type {(inputs: Onboardingsteppublishlanding3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất bản một landing page`;
  };

const en_onboardingsteppublishlanding3 =
  /** @type {(inputs: Onboardingsteppublishlanding3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Publish a landing page`;
  };

/**
 * | output |
 * | --- |
 * | "Publish a landing page" |
 *
 * @param {Onboardingsteppublishlanding3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingsteppublishlanding3 =
  /** @type {((inputs?: Onboardingsteppublishlanding3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingsteppublishlanding3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingsteppublishlanding3(inputs);
      return vi_onboardingsteppublishlanding3(inputs);
    }
  );
export { onboardingsteppublishlanding3 as "onboardingStepPublishLanding" };
