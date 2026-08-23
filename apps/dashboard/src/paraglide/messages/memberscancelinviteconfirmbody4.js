/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberscancelinviteconfirmbody4Inputs */

const vi_memberscancelinviteconfirmbody4 =
  /** @type {(inputs: Memberscancelinviteconfirmbody4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Họ sẽ không thể chấp nhận lời mời này nữa.`;
  };

const en_memberscancelinviteconfirmbody4 =
  /** @type {(inputs: Memberscancelinviteconfirmbody4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `They won't be able to accept this invitation anymore.`;
  };

/**
 * | output |
 * | --- |
 * | "They won't be able to accept this invitation anymore." |
 *
 * @param {Memberscancelinviteconfirmbody4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberscancelinviteconfirmbody4 =
  /** @type {((inputs?: Memberscancelinviteconfirmbody4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberscancelinviteconfirmbody4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberscancelinviteconfirmbody4(inputs);
      return vi_memberscancelinviteconfirmbody4(inputs);
    }
  );
export { memberscancelinviteconfirmbody4 as "membersCancelInviteConfirmBody" };
