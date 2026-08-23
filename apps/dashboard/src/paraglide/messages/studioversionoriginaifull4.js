/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionoriginaifull4Inputs */

const vi_studioversionoriginaifull4 =
  /** @type {(inputs: Studioversionoriginaifull4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `AI tạo`;
  };

const en_studioversionoriginaifull4 =
  /** @type {(inputs: Studioversionoriginaifull4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `AI generated`;
  };

/**
 * | output |
 * | --- |
 * | "AI generated" |
 *
 * @param {Studioversionoriginaifull4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionoriginaifull4 =
  /** @type {((inputs?: Studioversionoriginaifull4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionoriginaifull4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionoriginaifull4(inputs);
      return vi_studioversionoriginaifull4(inputs);
    }
  );
export { studioversionoriginaifull4 as "studioVersionOriginAiFull" };
