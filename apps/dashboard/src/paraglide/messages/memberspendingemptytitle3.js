/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberspendingemptytitle3Inputs */

const vi_memberspendingemptytitle3 =
  /** @type {(inputs: Memberspendingemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không có lời mời nào đang chờ`;
  };

const en_memberspendingemptytitle3 =
  /** @type {(inputs: Memberspendingemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No pending invitations`;
  };

/**
 * | output |
 * | --- |
 * | "No pending invitations" |
 *
 * @param {Memberspendingemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberspendingemptytitle3 =
  /** @type {((inputs?: Memberspendingemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberspendingemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberspendingemptytitle3(inputs);
      return vi_memberspendingemptytitle3(inputs);
    }
  );
export { memberspendingemptytitle3 as "membersPendingEmptyTitle" };
