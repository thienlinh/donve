/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionlabelbutton3Inputs */

const vi_studioversionlabelbutton3 =
  /** @type {(inputs: Studioversionlabelbutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhãn`;
  };

const en_studioversionlabelbutton3 =
  /** @type {(inputs: Studioversionlabelbutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Label`;
  };

/**
 * | output |
 * | --- |
 * | "Label" |
 *
 * @param {Studioversionlabelbutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionlabelbutton3 =
  /** @type {((inputs?: Studioversionlabelbutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionlabelbutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionlabelbutton3(inputs);
      return vi_studioversionlabelbutton3(inputs);
    }
  );
export { studioversionlabelbutton3 as "studioVersionLabelButton" };
