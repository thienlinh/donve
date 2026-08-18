/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roleadmin1Inputs */

const vi_roleadmin1 =
  /** @type {(inputs: Roleadmin1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quản trị viên`;
  };

const en_roleadmin1 =
  /** @type {(inputs: Roleadmin1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Admin`;
  };

/**
 * | output |
 * | --- |
 * | "Admin" |
 *
 * @param {Roleadmin1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const roleadmin1 =
  /** @type {((inputs?: Roleadmin1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roleadmin1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_roleadmin1(inputs);
      return vi_roleadmin1(inputs);
    }
  );
export { roleadmin1 as "roleAdmin" };
