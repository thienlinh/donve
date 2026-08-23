/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersremoveconfirmaction3Inputs */

const vi_membersremoveconfirmaction3 =
  /** @type {(inputs: Membersremoveconfirmaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa thành viên`;
  };

const en_membersremoveconfirmaction3 =
  /** @type {(inputs: Membersremoveconfirmaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove member`;
  };

/**
 * | output |
 * | --- |
 * | "Remove member" |
 *
 * @param {Membersremoveconfirmaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersremoveconfirmaction3 =
  /** @type {((inputs?: Membersremoveconfirmaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersremoveconfirmaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersremoveconfirmaction3(inputs);
      return vi_membersremoveconfirmaction3(inputs);
    }
  );
export { membersremoveconfirmaction3 as "membersRemoveConfirmAction" };
