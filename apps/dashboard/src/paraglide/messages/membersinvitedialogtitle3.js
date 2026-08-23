/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersinvitedialogtitle3Inputs */

const vi_membersinvitedialogtitle3 =
  /** @type {(inputs: Membersinvitedialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mời thành viên mới`;
  };

const en_membersinvitedialogtitle3 =
  /** @type {(inputs: Membersinvitedialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Invite a member`;
  };

/**
 * | output |
 * | --- |
 * | "Invite a member" |
 *
 * @param {Membersinvitedialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitedialogtitle3 =
  /** @type {((inputs?: Membersinvitedialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitedialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersinvitedialogtitle3(inputs);
      return vi_membersinvitedialogtitle3(inputs);
    }
  );
export { membersinvitedialogtitle3 as "membersInviteDialogTitle" };
