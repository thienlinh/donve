/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiochatemptydescription3Inputs */

const vi_studiochatemptydescription3 =
  /** @type {(inputs: Studiochatemptydescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhờ AI tạo hoặc chỉnh trang này.`;
  };

const en_studiochatemptydescription3 =
  /** @type {(inputs: Studiochatemptydescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ask the AI to generate or tweak this page.`;
  };

/**
 * | output |
 * | --- |
 * | "Ask the AI to generate or tweak this page." |
 *
 * @param {Studiochatemptydescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiochatemptydescription3 =
  /** @type {((inputs?: Studiochatemptydescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiochatemptydescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiochatemptydescription3(inputs);
      return vi_studiochatemptydescription3(inputs);
    }
  );
export { studiochatemptydescription3 as "studioChatEmptyDescription" };
