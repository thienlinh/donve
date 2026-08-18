/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiusageemptytitle3Inputs */

const vi_aiusageemptytitle3 =
  /** @type {(inputs: Aiusageemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có dữ liệu sử dụng`;
  };

const en_aiusageemptytitle3 =
  /** @type {(inputs: Aiusageemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No usage yet`;
  };

/**
 * | output |
 * | --- |
 * | "No usage yet" |
 *
 * @param {Aiusageemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiusageemptytitle3 =
  /** @type {((inputs?: Aiusageemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiusageemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiusageemptytitle3(inputs);
      return vi_aiusageemptytitle3(inputs);
    }
  );
export { aiusageemptytitle3 as "aiUsageEmptyTitle" };
