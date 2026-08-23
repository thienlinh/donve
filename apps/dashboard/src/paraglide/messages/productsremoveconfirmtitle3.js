/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Productsremoveconfirmtitle3Inputs */

const vi_productsremoveconfirmtitle3 =
  /** @type {(inputs: Productsremoveconfirmtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Xoá ${i?.name}?`;
  };

const en_productsremoveconfirmtitle3 =
  /** @type {(inputs: Productsremoveconfirmtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Remove ${i?.name}?`;
  };

/**
 * | output |
 * | --- |
 * | "Remove {name}?" |
 *
 * @param {Productsremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsremoveconfirmtitle3 =
  /** @type {((inputs: Productsremoveconfirmtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsremoveconfirmtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsremoveconfirmtitle3(inputs);
      return vi_productsremoveconfirmtitle3(inputs);
    }
  );
export { productsremoveconfirmtitle3 as "productsRemoveConfirmTitle" };
