/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberscolumnrole2Inputs */

const vi_memberscolumnrole2 =
  /** @type {(inputs: Memberscolumnrole2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Vai trò`;
  };

const en_memberscolumnrole2 =
  /** @type {(inputs: Memberscolumnrole2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Role`;
  };

/**
 * | output |
 * | --- |
 * | "Role" |
 *
 * @param {Memberscolumnrole2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberscolumnrole2 =
  /** @type {((inputs?: Memberscolumnrole2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberscolumnrole2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberscolumnrole2(inputs);
      return vi_memberscolumnrole2(inputs);
    }
  );
export { memberscolumnrole2 as "membersColumnRole" };
