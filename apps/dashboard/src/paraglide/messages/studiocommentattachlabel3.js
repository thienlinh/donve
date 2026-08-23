/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentattachlabel3Inputs */

const vi_studiocommentattachlabel3 =
  /** @type {(inputs: Studiocommentattachlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đính kèm tệp`;
  };

const en_studiocommentattachlabel3 =
  /** @type {(inputs: Studiocommentattachlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Attach file`;
  };

/**
 * | output |
 * | --- |
 * | "Attach file" |
 *
 * @param {Studiocommentattachlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentattachlabel3 =
  /** @type {((inputs?: Studiocommentattachlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentattachlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentattachlabel3(inputs);
      return vi_studiocommentattachlabel3(inputs);
    }
  );
export { studiocommentattachlabel3 as "studioCommentAttachLabel" };
