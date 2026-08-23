/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersinvitebutton2Inputs */

const vi_membersinvitebutton2 =
  /** @type {(inputs: Membersinvitebutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mời thành viên`;
  };

const en_membersinvitebutton2 =
  /** @type {(inputs: Membersinvitebutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Invite member`;
  };

/**
 * | output |
 * | --- |
 * | "Invite member" |
 *
 * @param {Membersinvitebutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitebutton2 =
  /** @type {((inputs?: Membersinvitebutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitebutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersinvitebutton2(inputs);
      return vi_membersinvitebutton2(inputs);
    }
  );
export { membersinvitebutton2 as "membersInviteButton" };
