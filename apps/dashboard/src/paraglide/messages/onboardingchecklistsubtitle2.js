/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ done: NonNullable<unknown>, total: NonNullable<unknown> }} Onboardingchecklistsubtitle2Inputs */

const vi_onboardingchecklistsubtitle2 =
  /** @type {(inputs: Onboardingchecklistsubtitle2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã xong ${i?.done}/${i?.total} bước`;
  };

const en_onboardingchecklistsubtitle2 =
  /** @type {(inputs: Onboardingchecklistsubtitle2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.done}/${i?.total} steps done`;
  };

/**
 * | output |
 * | --- |
 * | "{done}/{total} steps done" |
 *
 * @param {Onboardingchecklistsubtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingchecklistsubtitle2 =
  /** @type {((inputs: Onboardingchecklistsubtitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingchecklistsubtitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingchecklistsubtitle2(inputs);
      return vi_onboardingchecklistsubtitle2(inputs);
    }
  );
export { onboardingchecklistsubtitle2 as "onboardingChecklistSubtitle" };
