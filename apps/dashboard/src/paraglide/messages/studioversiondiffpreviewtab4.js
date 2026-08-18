/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversiondiffpreviewtab4Inputs */

const vi_studioversiondiffpreviewtab4 =
  /** @type {(inputs: Studioversiondiffpreviewtab4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xem trước`;
  };

const en_studioversiondiffpreviewtab4 =
  /** @type {(inputs: Studioversiondiffpreviewtab4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Preview`;
  };

/**
 * | output |
 * | --- |
 * | "Preview" |
 *
 * @param {Studioversiondiffpreviewtab4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversiondiffpreviewtab4 =
  /** @type {((inputs?: Studioversiondiffpreviewtab4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversiondiffpreviewtab4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversiondiffpreviewtab4(inputs);
      return vi_studioversiondiffpreviewtab4(inputs);
    }
  );
export { studioversiondiffpreviewtab4 as "studioVersionDiffPreviewTab" };
