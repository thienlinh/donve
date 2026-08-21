/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiorollbacksuccesstoast3Inputs */

const vi_studiorollbacksuccesstoast3 =
  /** @type {(inputs: Studiorollbacksuccesstoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã rollback`;
  };

const en_studiorollbacksuccesstoast3 =
  /** @type {(inputs: Studiorollbacksuccesstoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Rolled back`;
  };

/**
 * | output |
 * | --- |
 * | "Rolled back" |
 *
 * @param {Studiorollbacksuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiorollbacksuccesstoast3 =
  /** @type {((inputs?: Studiorollbacksuccesstoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiorollbacksuccesstoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiorollbacksuccesstoast3(inputs);
      return vi_studiorollbacksuccesstoast3(inputs);
    }
  );
export { studiorollbacksuccesstoast3 as "studioRollbackSuccessToast" };
