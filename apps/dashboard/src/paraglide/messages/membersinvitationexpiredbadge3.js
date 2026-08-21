/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersinvitationexpiredbadge3Inputs */

const vi_membersinvitationexpiredbadge3 =
  /** @type {(inputs: Membersinvitationexpiredbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã hết hạn`;
  };

const en_membersinvitationexpiredbadge3 =
  /** @type {(inputs: Membersinvitationexpiredbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Expired`;
  };

/**
 * | output |
 * | --- |
 * | "Expired" |
 *
 * @param {Membersinvitationexpiredbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitationexpiredbadge3 =
  /** @type {((inputs?: Membersinvitationexpiredbadge3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitationexpiredbadge3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersinvitationexpiredbadge3(inputs);
      return vi_membersinvitationexpiredbadge3(inputs);
    }
  );
export { membersinvitationexpiredbadge3 as "membersInvitationExpiredBadge" };
