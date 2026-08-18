/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ member: NonNullable<unknown> }} Membersremoveconfirmtitle3Inputs */

const vi_membersremoveconfirmtitle3 =
  /** @type {(inputs: Membersremoveconfirmtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Xóa ${i?.member} khỏi tổ chức?`;
  };

const en_membersremoveconfirmtitle3 =
  /** @type {(inputs: Membersremoveconfirmtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Remove ${i?.member}?`;
  };

/**
 * | output |
 * | --- |
 * | "Remove {member}?" |
 *
 * @param {Membersremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersremoveconfirmtitle3 =
  /** @type {((inputs: Membersremoveconfirmtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersremoveconfirmtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersremoveconfirmtitle3(inputs);
      return vi_membersremoveconfirmtitle3(inputs);
    }
  );
export { membersremoveconfirmtitle3 as "membersRemoveConfirmTitle" };
