/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersinvitedialogdescription3Inputs */

const vi_membersinvitedialogdescription3 =
  /** @type {(inputs: Membersinvitedialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Họ sẽ thấy lời mời này vào lần đăng nhập tiếp theo bằng email này.`;
  };

const en_membersinvitedialogdescription3 =
  /** @type {(inputs: Membersinvitedialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `They'll see this invitation the next time they sign in with this email.`;
  };

/**
 * | output |
 * | --- |
 * | "They'll see this invitation the next time they sign in with this email." |
 *
 * @param {Membersinvitedialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitedialogdescription3 =
  /** @type {((inputs?: Membersinvitedialogdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitedialogdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersinvitedialogdescription3(inputs);
      return vi_membersinvitedialogdescription3(inputs);
    }
  );
export { membersinvitedialogdescription3 as "membersInviteDialogDescription" };
