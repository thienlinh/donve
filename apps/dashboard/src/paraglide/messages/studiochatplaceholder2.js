/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiochatplaceholder2Inputs */

const vi_studiochatplaceholder2 =
  /** @type {(inputs: Studiochatplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhờ AI chỉnh sửa trang này...`;
  };

const en_studiochatplaceholder2 =
  /** @type {(inputs: Studiochatplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ask AI to edit this page...`;
  };

/**
 * | output |
 * | --- |
 * | "Ask AI to edit this page..." |
 *
 * @param {Studiochatplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiochatplaceholder2 =
  /** @type {((inputs?: Studiochatplaceholder2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiochatplaceholder2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiochatplaceholder2(inputs);
      return vi_studiochatplaceholder2(inputs);
    }
  );
export { studiochatplaceholder2 as "studioChatPlaceholder" };
