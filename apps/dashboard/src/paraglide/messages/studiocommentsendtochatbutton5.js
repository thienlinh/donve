/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentsendtochatbutton5Inputs */

const vi_studiocommentsendtochatbutton5 =
  /** @type {(inputs: Studiocommentsendtochatbutton5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gửi vào Chat`;
  };

const en_studiocommentsendtochatbutton5 =
  /** @type {(inputs: Studiocommentsendtochatbutton5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Send to Chat`;
  };

/**
 * | output |
 * | --- |
 * | "Send to Chat" |
 *
 * @param {Studiocommentsendtochatbutton5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentsendtochatbutton5 =
  /** @type {((inputs?: Studiocommentsendtochatbutton5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentsendtochatbutton5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentsendtochatbutton5(inputs);
      return vi_studiocommentsendtochatbutton5(inputs);
    }
  );
export { studiocommentsendtochatbutton5 as "studioCommentSendToChatButton" };
