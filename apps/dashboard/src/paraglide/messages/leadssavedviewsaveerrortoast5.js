/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssavedviewsaveerrortoast5Inputs */

const vi_leadssavedviewsaveerrortoast5 =
  /** @type {(inputs: Leadssavedviewsaveerrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không lưu được bộ lọc này. Thử lại.`;
  };

const en_leadssavedviewsaveerrortoast5 =
  /** @type {(inputs: Leadssavedviewsaveerrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't save this view. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't save this view. Try again." |
 *
 * @param {Leadssavedviewsaveerrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssavedviewsaveerrortoast5 =
  /** @type {((inputs?: Leadssavedviewsaveerrortoast5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssavedviewsaveerrortoast5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssavedviewsaveerrortoast5(inputs);
      return vi_leadssavedviewsaveerrortoast5(inputs);
    }
  );
export { leadssavedviewsaveerrortoast5 as "leadsSavedViewSaveErrorToast" };
