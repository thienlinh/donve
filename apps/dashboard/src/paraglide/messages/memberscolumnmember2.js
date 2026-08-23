/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberscolumnmember2Inputs */

const vi_memberscolumnmember2 =
  /** @type {(inputs: Memberscolumnmember2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thành viên`;
  };

const en_memberscolumnmember2 =
  /** @type {(inputs: Memberscolumnmember2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Member`;
  };

/**
 * | output |
 * | --- |
 * | "Member" |
 *
 * @param {Memberscolumnmember2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberscolumnmember2 =
  /** @type {((inputs?: Memberscolumnmember2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberscolumnmember2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberscolumnmember2(inputs);
      return vi_memberscolumnmember2(inputs);
    }
  );
export { memberscolumnmember2 as "membersColumnMember" };
