/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skilleditdialogtitle3Inputs */

const vi_skilleditdialogtitle3 =
  /** @type {(inputs: Skilleditdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chỉnh sửa kỹ năng`;
  };

const en_skilleditdialogtitle3 =
  /** @type {(inputs: Skilleditdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Edit skill`;
  };

/**
 * | output |
 * | --- |
 * | "Edit skill" |
 *
 * @param {Skilleditdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skilleditdialogtitle3 =
  /** @type {((inputs?: Skilleditdialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skilleditdialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skilleditdialogtitle3(inputs);
      return vi_skilleditdialogtitle3(inputs);
    }
  );
export { skilleditdialogtitle3 as "skillEditDialogTitle" };
