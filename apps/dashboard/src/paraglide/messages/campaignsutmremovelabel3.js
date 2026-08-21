/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsutmremovelabel3Inputs */

const vi_campaignsutmremovelabel3 =
  /** @type {(inputs: Campaignsutmremovelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá tham số`;
  };

const en_campaignsutmremovelabel3 =
  /** @type {(inputs: Campaignsutmremovelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove parameter`;
  };

/**
 * | output |
 * | --- |
 * | "Remove parameter" |
 *
 * @param {Campaignsutmremovelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsutmremovelabel3 =
  /** @type {((inputs?: Campaignsutmremovelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsutmremovelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsutmremovelabel3(inputs);
      return vi_campaignsutmremovelabel3(inputs);
    }
  );
export { campaignsutmremovelabel3 as "campaignsUtmRemoveLabel" };
