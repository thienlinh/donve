/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillremoveconfirmbody3Inputs */

const vi_skillremoveconfirmbody3 =
  /** @type {(inputs: Skillremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Các landing page đang dùng nó theo mặc định sẽ không còn áp dụng nữa.`;
  };

const en_skillremoveconfirmbody3 =
  /** @type {(inputs: Skillremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Landing pages using it by default will no longer apply it.`;
  };

/**
 * | output |
 * | --- |
 * | "Landing pages using it by default will no longer apply it." |
 *
 * @param {Skillremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillremoveconfirmbody3 =
  /** @type {((inputs?: Skillremoveconfirmbody3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillremoveconfirmbody3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillremoveconfirmbody3(inputs);
      return vi_skillremoveconfirmbody3(inputs);
    }
  );
export { skillremoveconfirmbody3 as "skillRemoveConfirmBody" };
