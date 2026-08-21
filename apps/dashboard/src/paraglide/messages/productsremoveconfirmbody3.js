/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsremoveconfirmbody3Inputs */

const vi_productsremoveconfirmbody3 =
  /** @type {(inputs: Productsremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sản phẩm này sẽ không còn gắn được vào chiến dịch nữa.`;
  };

const en_productsremoveconfirmbody3 =
  /** @type {(inputs: Productsremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `This product will no longer be available to attach to campaigns.`;
  };

/**
 * | output |
 * | --- |
 * | "This product will no longer be available to attach to campaigns." |
 *
 * @param {Productsremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsremoveconfirmbody3 =
  /** @type {((inputs?: Productsremoveconfirmbody3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsremoveconfirmbody3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsremoveconfirmbody3(inputs);
      return vi_productsremoveconfirmbody3(inputs);
    }
  );
export { productsremoveconfirmbody3 as "productsRemoveConfirmBody" };
