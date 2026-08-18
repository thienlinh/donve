/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionhistoryempty3Inputs */

const vi_studioversionhistoryempty3 =
  /** @type {(inputs: Studioversionhistoryempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có phiên bản nào.`;
  };

const en_studioversionhistoryempty3 =
  /** @type {(inputs: Studioversionhistoryempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No versions yet.`;
  };

/**
 * | output |
 * | --- |
 * | "No versions yet." |
 *
 * @param {Studioversionhistoryempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionhistoryempty3 =
  /** @type {((inputs?: Studioversionhistoryempty3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionhistoryempty3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionhistoryempty3(inputs);
      return vi_studioversionhistoryempty3(inputs);
    }
  );
export { studioversionhistoryempty3 as "studioVersionHistoryEmpty" };
