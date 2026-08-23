/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersinvitesubmit2Inputs */

const vi_membersinvitesubmit2 =
  /** @type {(inputs: Membersinvitesubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gửi lời mời`;
  };

const en_membersinvitesubmit2 =
  /** @type {(inputs: Membersinvitesubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Send invite`;
  };

/**
 * | output |
 * | --- |
 * | "Send invite" |
 *
 * @param {Membersinvitesubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitesubmit2 =
  /** @type {((inputs?: Membersinvitesubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitesubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersinvitesubmit2(inputs);
      return vi_membersinvitesubmit2(inputs);
    }
  );
export { membersinvitesubmit2 as "membersInviteSubmit" };
