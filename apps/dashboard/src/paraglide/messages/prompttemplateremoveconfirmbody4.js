/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateremoveconfirmbody4Inputs */

const vi_prompttemplateremoveconfirmbody4 =
  /** @type {(inputs: Prompttemplateremoveconfirmbody4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Các landing page đang dùng nó sẽ chuyển về mặc định của nền tảng.`;
  };

const en_prompttemplateremoveconfirmbody4 =
  /** @type {(inputs: Prompttemplateremoveconfirmbody4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Landing pages using it will fall back to the platform default.`;
  };

/**
 * | output |
 * | --- |
 * | "Landing pages using it will fall back to the platform default." |
 *
 * @param {Prompttemplateremoveconfirmbody4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateremoveconfirmbody4 =
  /** @type {((inputs?: Prompttemplateremoveconfirmbody4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateremoveconfirmbody4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateremoveconfirmbody4(inputs);
      return vi_prompttemplateremoveconfirmbody4(inputs);
    }
  );
export { prompttemplateremoveconfirmbody4 as "promptTemplateRemoveConfirmBody" };
