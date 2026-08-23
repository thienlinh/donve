/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ email: NonNullable<unknown> }} Memberscancelinvitesuccesstoast4Inputs */

const vi_memberscancelinvitesuccesstoast4 =
  /** @type {(inputs: Memberscancelinvitesuccesstoast4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã hủy lời mời gửi đến ${i?.email}`;
  };

const en_memberscancelinvitesuccesstoast4 =
  /** @type {(inputs: Memberscancelinvitesuccesstoast4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Invitation to ${i?.email} cancelled`;
  };

/**
 * | output |
 * | --- |
 * | "Invitation to {email} cancelled" |
 *
 * @param {Memberscancelinvitesuccesstoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberscancelinvitesuccesstoast4 =
  /** @type {((inputs: Memberscancelinvitesuccesstoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberscancelinvitesuccesstoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberscancelinvitesuccesstoast4(inputs);
      return vi_memberscancelinvitesuccesstoast4(inputs);
    }
  );
export { memberscancelinvitesuccesstoast4 as "membersCancelInviteSuccessToast" };
