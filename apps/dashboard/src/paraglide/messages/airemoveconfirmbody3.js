/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Airemoveconfirmbody3Inputs */

const vi_airemoveconfirmbody3 =
  /** @type {(inputs: Airemoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Các lần tạo sau sẽ không dùng được key này nữa.`;
  };

const en_airemoveconfirmbody3 =
  /** @type {(inputs: Airemoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Generations won't be able to use this key anymore.`;
  };

/**
 * | output |
 * | --- |
 * | "Generations won't be able to use this key anymore." |
 *
 * @param {Airemoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const airemoveconfirmbody3 =
  /** @type {((inputs?: Airemoveconfirmbody3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Airemoveconfirmbody3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_airemoveconfirmbody3(inputs);
      return vi_airemoveconfirmbody3(inputs);
    }
  );
export { airemoveconfirmbody3 as "aiRemoveConfirmBody" };
