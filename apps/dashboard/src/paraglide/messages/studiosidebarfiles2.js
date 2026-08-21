/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiosidebarfiles2Inputs */

const vi_studiosidebarfiles2 =
  /** @type {(inputs: Studiosidebarfiles2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Files`;
  };

const en_studiosidebarfiles2 =
  /** @type {(inputs: Studiosidebarfiles2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Files`;
  };

/**
 * | output |
 * | --- |
 * | "Files" |
 *
 * @param {Studiosidebarfiles2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiosidebarfiles2 =
  /** @type {((inputs?: Studiosidebarfiles2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiosidebarfiles2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiosidebarfiles2(inputs);
      return vi_studiosidebarfiles2(inputs);
    }
  );
export { studiosidebarfiles2 as "studioSidebarFiles" };
