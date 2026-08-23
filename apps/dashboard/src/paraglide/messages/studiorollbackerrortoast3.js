/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiorollbackerrortoast3Inputs */

const vi_studiorollbackerrortoast3 =
  /** @type {(inputs: Studiorollbackerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể rollback. Vui lòng thử lại.`;
  };

const en_studiorollbackerrortoast3 =
  /** @type {(inputs: Studiorollbackerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't roll back. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't roll back. Try again." |
 *
 * @param {Studiorollbackerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiorollbackerrortoast3 =
  /** @type {((inputs?: Studiorollbackerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiorollbackerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiorollbackerrortoast3(inputs);
      return vi_studiorollbackerrortoast3(inputs);
    }
  );
export { studiorollbackerrortoast3 as "studioRollbackErrorToast" };
