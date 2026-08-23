/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiosidebarhistory2Inputs */

const vi_studiosidebarhistory2 =
  /** @type {(inputs: Studiosidebarhistory2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lịch sử`;
  };

const en_studiosidebarhistory2 =
  /** @type {(inputs: Studiosidebarhistory2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `History`;
  };

/**
 * | output |
 * | --- |
 * | "History" |
 *
 * @param {Studiosidebarhistory2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiosidebarhistory2 =
  /** @type {((inputs?: Studiosidebarhistory2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiosidebarhistory2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiosidebarhistory2(inputs);
      return vi_studiosidebarhistory2(inputs);
    }
  );
export { studiosidebarhistory2 as "studioSidebarHistory" };
