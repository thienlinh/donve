/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionlabelerrortoast4Inputs */

const vi_studioversionlabelerrortoast4 =
  /** @type {(inputs: Studioversionlabelerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không lưu được nhãn. Vui lòng thử lại.`;
  };

const en_studioversionlabelerrortoast4 =
  /** @type {(inputs: Studioversionlabelerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't save the label. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't save the label. Try again." |
 *
 * @param {Studioversionlabelerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionlabelerrortoast4 =
  /** @type {((inputs?: Studioversionlabelerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionlabelerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionlabelerrortoast4(inputs);
      return vi_studioversionlabelerrortoast4(inputs);
    }
  );
export { studioversionlabelerrortoast4 as "studioVersionLabelErrorToast" };
