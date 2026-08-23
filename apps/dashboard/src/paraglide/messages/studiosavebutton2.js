/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiosavebutton2Inputs */

const vi_studiosavebutton2 =
  /** @type {(inputs: Studiosavebutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu`;
  };

const en_studiosavebutton2 =
  /** @type {(inputs: Studiosavebutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Save`;
  };

/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Studiosavebutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiosavebutton2 =
  /** @type {((inputs?: Studiosavebutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiosavebutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiosavebutton2(inputs);
      return vi_studiosavebutton2(inputs);
    }
  );
export { studiosavebutton2 as "studioSaveButton" };
