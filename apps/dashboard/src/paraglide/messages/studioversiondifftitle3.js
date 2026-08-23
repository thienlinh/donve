/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversiondifftitle3Inputs */

const vi_studioversiondifftitle3 =
  /** @type {(inputs: Studioversiondifftitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `So sánh phiên bản`;
  };

const en_studioversiondifftitle3 =
  /** @type {(inputs: Studioversiondifftitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Compare versions`;
  };

/**
 * | output |
 * | --- |
 * | "Compare versions" |
 *
 * @param {Studioversiondifftitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversiondifftitle3 =
  /** @type {((inputs?: Studioversiondifftitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversiondifftitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversiondifftitle3(inputs);
      return vi_studioversiondifftitle3(inputs);
    }
  );
export { studioversiondifftitle3 as "studioVersionDiffTitle" };
