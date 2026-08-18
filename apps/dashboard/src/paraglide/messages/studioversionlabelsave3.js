/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionlabelsave3Inputs */

const vi_studioversionlabelsave3 =
  /** @type {(inputs: Studioversionlabelsave3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu`;
  };

const en_studioversionlabelsave3 =
  /** @type {(inputs: Studioversionlabelsave3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Save`;
  };

/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Studioversionlabelsave3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionlabelsave3 =
  /** @type {((inputs?: Studioversionlabelsave3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionlabelsave3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionlabelsave3(inputs);
      return vi_studioversionlabelsave3(inputs);
    }
  );
export { studioversionlabelsave3 as "studioVersionLabelSave" };
