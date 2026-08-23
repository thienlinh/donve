/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberscolumnemail2Inputs */

const vi_memberscolumnemail2 =
  /** @type {(inputs: Memberscolumnemail2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`;
  };

const en_memberscolumnemail2 =
  /** @type {(inputs: Memberscolumnemail2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`;
  };

/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Memberscolumnemail2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberscolumnemail2 =
  /** @type {((inputs?: Memberscolumnemail2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberscolumnemail2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberscolumnemail2(inputs);
      return vi_memberscolumnemail2(inputs);
    }
  );
export { memberscolumnemail2 as "membersColumnEmail" };
