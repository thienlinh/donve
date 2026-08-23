/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingtitle1Inputs */

const vi_onboardingtitle1 =
  /** @type {(inputs: Onboardingtitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo tổ chức của bạn`;
  };

const en_onboardingtitle1 =
  /** @type {(inputs: Onboardingtitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Create your organization`;
  };

/**
 * | output |
 * | --- |
 * | "Create your organization" |
 *
 * @param {Onboardingtitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingtitle1 =
  /** @type {((inputs?: Onboardingtitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingtitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingtitle1(inputs);
      return vi_onboardingtitle1(inputs);
    }
  );
export { onboardingtitle1 as "onboardingTitle" };
