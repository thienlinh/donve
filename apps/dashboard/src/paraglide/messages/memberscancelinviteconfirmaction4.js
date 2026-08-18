/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberscancelinviteconfirmaction4Inputs */

const vi_memberscancelinviteconfirmaction4 =
  /** @type {(inputs: Memberscancelinviteconfirmaction4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hủy lời mời`;
  };

const en_memberscancelinviteconfirmaction4 =
  /** @type {(inputs: Memberscancelinviteconfirmaction4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cancel invitation`;
  };

/**
 * | output |
 * | --- |
 * | "Cancel invitation" |
 *
 * @param {Memberscancelinviteconfirmaction4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberscancelinviteconfirmaction4 =
  /** @type {((inputs?: Memberscancelinviteconfirmaction4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberscancelinviteconfirmaction4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberscancelinviteconfirmaction4(inputs);
      return vi_memberscancelinviteconfirmaction4(inputs);
    }
  );
export { memberscancelinviteconfirmaction4 as "membersCancelInviteConfirmAction" };
