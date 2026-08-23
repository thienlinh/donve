/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectionsdescription2Inputs */

const vi_aiconnectionsdescription2 =
  /** @type {(inputs: Aiconnectionsdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối API key của bạn để tạo bằng model riêng, hoặc dùng credit của nền tảng.`;
  };

const en_aiconnectionsdescription2 =
  /** @type {(inputs: Aiconnectionsdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect your own API key to generate with your models, or use platform credits.`;
  };

/**
 * | output |
 * | --- |
 * | "Connect your own API key to generate with your models, or use platform credits." |
 *
 * @param {Aiconnectionsdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectionsdescription2 =
  /** @type {((inputs?: Aiconnectionsdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectionsdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectionsdescription2(inputs);
      return vi_aiconnectionsdescription2(inputs);
    }
  );
export { aiconnectionsdescription2 as "aiConnectionsDescription" };
