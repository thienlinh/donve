/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersinvitationresponderrortoast4Inputs */

const vi_membersinvitationresponderrortoast4 =
  /** @type {(inputs: Membersinvitationresponderrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không xử lý được lời mời. Vui lòng thử lại.`;
  };

const en_membersinvitationresponderrortoast4 =
  /** @type {(inputs: Membersinvitationresponderrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't respond to the invitation. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't respond to the invitation. Try again." |
 *
 * @param {Membersinvitationresponderrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitationresponderrortoast4 =
  /** @type {((inputs?: Membersinvitationresponderrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitationresponderrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_membersinvitationresponderrortoast4(inputs);
      return vi_membersinvitationresponderrortoast4(inputs);
    }
  );
export { membersinvitationresponderrortoast4 as "membersInvitationRespondErrorToast" };
