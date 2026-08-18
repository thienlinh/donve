/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiolayersfooterhint3Inputs */

const vi_studiolayersfooterhint3 =
  /** @type {(inputs: Studiolayersfooterhint3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trên cùng danh sách = layer nằm trên cùng. Click biểu tượng mắt để ẩn.`;
  };

const en_studiolayersfooterhint3 =
  /** @type {(inputs: Studiolayersfooterhint3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Top of list = topmost layer. Click the eye icon to hide.`;
  };

/**
 * | output |
 * | --- |
 * | "Top of list = topmost layer. Click the eye icon to hide." |
 *
 * @param {Studiolayersfooterhint3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiolayersfooterhint3 =
  /** @type {((inputs?: Studiolayersfooterhint3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiolayersfooterhint3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiolayersfooterhint3(inputs);
      return vi_studiolayersfooterhint3(inputs);
    }
  );
export { studiolayersfooterhint3 as "studioLayersFooterHint" };
