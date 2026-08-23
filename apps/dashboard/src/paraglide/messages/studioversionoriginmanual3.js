/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionoriginmanual3Inputs */

const vi_studioversionoriginmanual3 =
  /** @type {(inputs: Studioversionoriginmanual3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chỉnh sửa thủ công`;
  };

const en_studioversionoriginmanual3 =
  /** @type {(inputs: Studioversionoriginmanual3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Manual edit`;
  };

/**
 * | output |
 * | --- |
 * | "Manual edit" |
 *
 * @param {Studioversionoriginmanual3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionoriginmanual3 =
  /** @type {((inputs?: Studioversionoriginmanual3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionoriginmanual3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionoriginmanual3(inputs);
      return vi_studioversionoriginmanual3(inputs);
    }
  );
export { studioversionoriginmanual3 as "studioVersionOriginManual" };
