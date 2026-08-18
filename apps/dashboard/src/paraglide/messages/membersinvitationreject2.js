/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersinvitationreject2Inputs */

const vi_membersinvitationreject2 =
  /** @type {(inputs: Membersinvitationreject2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Từ chối`;
  };

const en_membersinvitationreject2 =
  /** @type {(inputs: Membersinvitationreject2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Decline`;
  };

/**
 * | output |
 * | --- |
 * | "Decline" |
 *
 * @param {Membersinvitationreject2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitationreject2 =
  /** @type {((inputs?: Membersinvitationreject2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitationreject2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersinvitationreject2(inputs);
      return vi_membersinvitationreject2(inputs);
    }
  );
export { membersinvitationreject2 as "membersInvitationReject" };
