/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberspendingtitle2Inputs */

const vi_memberspendingtitle2 =
  /** @type {(inputs: Memberspendingtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lời mời đang chờ`;
  };

const en_memberspendingtitle2 =
  /** @type {(inputs: Memberspendingtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Pending invitations`;
  };

/**
 * | output |
 * | --- |
 * | "Pending invitations" |
 *
 * @param {Memberspendingtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberspendingtitle2 =
  /** @type {((inputs?: Memberspendingtitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberspendingtitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberspendingtitle2(inputs);
      return vi_memberspendingtitle2(inputs);
    }
  );
export { memberspendingtitle2 as "membersPendingTitle" };
