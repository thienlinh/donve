/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionhistorytitle3Inputs */

const vi_studioversionhistorytitle3 =
  /** @type {(inputs: Studioversionhistorytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lịch sử phiên bản`;
  };

const en_studioversionhistorytitle3 =
  /** @type {(inputs: Studioversionhistorytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Version history`;
  };

/**
 * | output |
 * | --- |
 * | "Version history" |
 *
 * @param {Studioversionhistorytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionhistorytitle3 =
  /** @type {((inputs?: Studioversionhistorytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionhistorytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionhistorytitle3(inputs);
      return vi_studioversionhistorytitle3(inputs);
    }
  );
export { studioversionhistorytitle3 as "studioVersionHistoryTitle" };
