/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingstepconnectai3Inputs */

const vi_onboardingstepconnectai3 =
  /** @type {(inputs: Onboardingstepconnectai3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối AI để tạo landing không giới hạn`;
  };

const en_onboardingstepconnectai3 =
  /** @type {(inputs: Onboardingstepconnectai3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect an AI provider for unlimited generation`;
  };

/**
 * | output |
 * | --- |
 * | "Connect an AI provider for unlimited generation" |
 *
 * @param {Onboardingstepconnectai3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingstepconnectai3 =
  /** @type {((inputs?: Onboardingstepconnectai3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingstepconnectai3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingstepconnectai3(inputs);
      return vi_onboardingstepconnectai3(inputs);
    }
  );
export { onboardingstepconnectai3 as "onboardingStepConnectAi" };
