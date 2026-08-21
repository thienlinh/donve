/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ email: NonNullable<unknown> }} Membersinvitesuccesstoast3Inputs */

const vi_membersinvitesuccesstoast3 =
  /** @type {(inputs: Membersinvitesuccesstoast3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã gửi lời mời đến ${i?.email}`;
  };

const en_membersinvitesuccesstoast3 =
  /** @type {(inputs: Membersinvitesuccesstoast3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Invite sent to ${i?.email}`;
  };

/**
 * | output |
 * | --- |
 * | "Invite sent to {email}" |
 *
 * @param {Membersinvitesuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitesuccesstoast3 =
  /** @type {((inputs: Membersinvitesuccesstoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitesuccesstoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersinvitesuccesstoast3(inputs);
      return vi_membersinvitesuccesstoast3(inputs);
    }
  );
export { membersinvitesuccesstoast3 as "membersInviteSuccessToast" };
