/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionoriginaipatch4Inputs */

const vi_studioversionoriginaipatch4 =
  /** @type {(inputs: Studioversionoriginaipatch4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `AI chỉnh sửa`;
  };

const en_studioversionoriginaipatch4 =
  /** @type {(inputs: Studioversionoriginaipatch4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `AI tweak`;
  };

/**
 * | output |
 * | --- |
 * | "AI tweak" |
 *
 * @param {Studioversionoriginaipatch4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionoriginaipatch4 =
  /** @type {((inputs?: Studioversionoriginaipatch4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionoriginaipatch4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionoriginaipatch4(inputs);
      return vi_studioversionoriginaipatch4(inputs);
    }
  );
export { studioversionoriginaipatch4 as "studioVersionOriginAiPatch" };
