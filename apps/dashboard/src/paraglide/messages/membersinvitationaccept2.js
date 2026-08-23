/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersinvitationaccept2Inputs */

const vi_membersinvitationaccept2 =
  /** @type {(inputs: Membersinvitationaccept2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chấp nhận`;
  };

const en_membersinvitationaccept2 =
  /** @type {(inputs: Membersinvitationaccept2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Accept`;
  };

/**
 * | output |
 * | --- |
 * | "Accept" |
 *
 * @param {Membersinvitationaccept2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitationaccept2 =
  /** @type {((inputs?: Membersinvitationaccept2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitationaccept2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersinvitationaccept2(inputs);
      return vi_membersinvitationaccept2(inputs);
    }
  );
export { membersinvitationaccept2 as "membersInvitationAccept" };
