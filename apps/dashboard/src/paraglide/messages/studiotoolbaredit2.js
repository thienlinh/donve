/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiotoolbaredit2Inputs */

const vi_studiotoolbaredit2 =
  /** @type {(inputs: Studiotoolbaredit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chỉnh sửa`;
  };

const en_studiotoolbaredit2 =
  /** @type {(inputs: Studiotoolbaredit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Edit`;
  };

/**
 * | output |
 * | --- |
 * | "Edit" |
 *
 * @param {Studiotoolbaredit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiotoolbaredit2 =
  /** @type {((inputs?: Studiotoolbaredit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiotoolbaredit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiotoolbaredit2(inputs);
      return vi_studiotoolbaredit2(inputs);
    }
  );
export { studiotoolbaredit2 as "studioToolbarEdit" };
