/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ email: NonNullable<unknown> }} Memberscancelinviteconfirmtitle4Inputs */

const vi_memberscancelinviteconfirmtitle4 =
  /** @type {(inputs: Memberscancelinviteconfirmtitle4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Hủy lời mời gửi đến ${i?.email}?`;
  };

const en_memberscancelinviteconfirmtitle4 =
  /** @type {(inputs: Memberscancelinviteconfirmtitle4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Cancel invitation to ${i?.email}?`;
  };

/**
 * | output |
 * | --- |
 * | "Cancel invitation to {email}?" |
 *
 * @param {Memberscancelinviteconfirmtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberscancelinviteconfirmtitle4 =
  /** @type {((inputs: Memberscancelinviteconfirmtitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberscancelinviteconfirmtitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberscancelinviteconfirmtitle4(inputs);
      return vi_memberscancelinviteconfirmtitle4(inputs);
    }
  );
export { memberscancelinviteconfirmtitle4 as "membersCancelInviteConfirmTitle" };
