/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawsendbutton3Inputs */

const vi_studiodrawsendbutton3 =
  /** @type {(inputs: Studiodrawsendbutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gửi`;
  };

const en_studiodrawsendbutton3 =
  /** @type {(inputs: Studiodrawsendbutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Send`;
  };

/**
 * | output |
 * | --- |
 * | "Send" |
 *
 * @param {Studiodrawsendbutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawsendbutton3 =
  /** @type {((inputs?: Studiodrawsendbutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawsendbutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawsendbutton3(inputs);
      return vi_studiodrawsendbutton3(inputs);
    }
  );
export { studiodrawsendbutton3 as "studioDrawSendButton" };
