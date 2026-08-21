/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodeployhistorytitle3Inputs */

const vi_studiodeployhistorytitle3 =
  /** @type {(inputs: Studiodeployhistorytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lịch sử triển khai`;
  };

const en_studiodeployhistorytitle3 =
  /** @type {(inputs: Studiodeployhistorytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Deploy history`;
  };

/**
 * | output |
 * | --- |
 * | "Deploy history" |
 *
 * @param {Studiodeployhistorytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodeployhistorytitle3 =
  /** @type {((inputs?: Studiodeployhistorytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodeployhistorytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodeployhistorytitle3(inputs);
      return vi_studiodeployhistorytitle3(inputs);
    }
  );
export { studiodeployhistorytitle3 as "studioDeployHistoryTitle" };
