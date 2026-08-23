/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversiondiffcodetab4Inputs */

const vi_studioversiondiffcodetab4 =
  /** @type {(inputs: Studioversiondiffcodetab4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Diff HTML`;
  };

const en_studioversiondiffcodetab4 =
  /** @type {(inputs: Studioversiondiffcodetab4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `HTML diff`;
  };

/**
 * | output |
 * | --- |
 * | "HTML diff" |
 *
 * @param {Studioversiondiffcodetab4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversiondiffcodetab4 =
  /** @type {((inputs?: Studioversiondiffcodetab4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversiondiffcodetab4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversiondiffcodetab4(inputs);
      return vi_studioversiondiffcodetab4(inputs);
    }
  );
export { studioversiondiffcodetab4 as "studioVersionDiffCodeTab" };
