/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectionsemptytitle3Inputs */

const vi_aiconnectionsemptytitle3 =
  /** @type {(inputs: Aiconnectionsemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có kết nối nào`;
  };

const en_aiconnectionsemptytitle3 =
  /** @type {(inputs: Aiconnectionsemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No connections yet`;
  };

/**
 * | output |
 * | --- |
 * | "No connections yet" |
 *
 * @param {Aiconnectionsemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectionsemptytitle3 =
  /** @type {((inputs?: Aiconnectionsemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectionsemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectionsemptytitle3(inputs);
      return vi_aiconnectionsemptytitle3(inputs);
    }
  );
export { aiconnectionsemptytitle3 as "aiConnectionsEmptyTitle" };
