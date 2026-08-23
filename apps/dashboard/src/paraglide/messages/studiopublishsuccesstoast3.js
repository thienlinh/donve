/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hostname: NonNullable<unknown> }} Studiopublishsuccesstoast3Inputs */

const vi_studiopublishsuccesstoast3 =
  /** @type {(inputs: Studiopublishsuccesstoast3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã xuất bản tại ${i?.hostname}`;
  };

const en_studiopublishsuccesstoast3 =
  /** @type {(inputs: Studiopublishsuccesstoast3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Published at ${i?.hostname}`;
  };

/**
 * | output |
 * | --- |
 * | "Published at {hostname}" |
 *
 * @param {Studiopublishsuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishsuccesstoast3 =
  /** @type {((inputs: Studiopublishsuccesstoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishsuccesstoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishsuccesstoast3(inputs);
      return vi_studiopublishsuccesstoast3(inputs);
    }
  );
export { studiopublishsuccesstoast3 as "studioPublishSuccessToast" };
