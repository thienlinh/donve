/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ member: NonNullable<unknown> }} Membersremovesuccesstoast3Inputs */

const vi_membersremovesuccesstoast3 =
  /** @type {(inputs: Membersremovesuccesstoast3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã xóa ${i?.member} khỏi tổ chức`;
  };

const en_membersremovesuccesstoast3 =
  /** @type {(inputs: Membersremovesuccesstoast3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.member} removed from the organization`;
  };

/**
 * | output |
 * | --- |
 * | "{member} removed from the organization" |
 *
 * @param {Membersremovesuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersremovesuccesstoast3 =
  /** @type {((inputs: Membersremovesuccesstoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersremovesuccesstoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersremovesuccesstoast3(inputs);
      return vi_membersremovesuccesstoast3(inputs);
    }
  );
export { membersremovesuccesstoast3 as "membersRemoveSuccessToast" };
