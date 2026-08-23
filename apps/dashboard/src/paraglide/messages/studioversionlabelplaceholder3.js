/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionlabelplaceholder3Inputs */

const vi_studioversionlabelplaceholder3 =
  /** @type {(inputs: Studioversionlabelplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm nhãn…`;
  };

const en_studioversionlabelplaceholder3 =
  /** @type {(inputs: Studioversionlabelplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add a label…`;
  };

/**
 * | output |
 * | --- |
 * | "Add a label…" |
 *
 * @param {Studioversionlabelplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionlabelplaceholder3 =
  /** @type {((inputs?: Studioversionlabelplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionlabelplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionlabelplaceholder3(inputs);
      return vi_studioversionlabelplaceholder3(inputs);
    }
  );
export { studioversionlabelplaceholder3 as "studioVersionLabelPlaceholder" };
