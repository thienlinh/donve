/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionviewchatbutton4Inputs */

const vi_studioversionviewchatbutton4 =
  /** @type {(inputs: Studioversionviewchatbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xem đoạn chat`;
  };

const en_studioversionviewchatbutton4 =
  /** @type {(inputs: Studioversionviewchatbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `View chat message`;
  };

/**
 * | output |
 * | --- |
 * | "View chat message" |
 *
 * @param {Studioversionviewchatbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionviewchatbutton4 =
  /** @type {((inputs?: Studioversionviewchatbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionviewchatbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionviewchatbutton4(inputs);
      return vi_studioversionviewchatbutton4(inputs);
    }
  );
export { studioversionviewchatbutton4 as "studioVersionViewChatButton" };
