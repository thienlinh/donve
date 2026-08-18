/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiochatemptytitle3Inputs */

const vi_studiochatemptytitle3 =
  /** @type {(inputs: Studiochatemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có tin nhắn`;
  };

const en_studiochatemptytitle3 =
  /** @type {(inputs: Studiochatemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No messages yet`;
  };

/**
 * | output |
 * | --- |
 * | "No messages yet" |
 *
 * @param {Studiochatemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiochatemptytitle3 =
  /** @type {((inputs?: Studiochatemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiochatemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiochatemptytitle3(inputs);
      return vi_studiochatemptytitle3(inputs);
    }
  );
export { studiochatemptytitle3 as "studioChatEmptyTitle" };
