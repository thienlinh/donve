/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shelllogout1Inputs */

const vi_shelllogout1 =
  /** @type {(inputs: Shelllogout1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đăng xuất`;
  };

const en_shelllogout1 =
  /** @type {(inputs: Shelllogout1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Log out`;
  };

/**
 * | output |
 * | --- |
 * | "Log out" |
 *
 * @param {Shelllogout1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shelllogout1 =
  /** @type {((inputs?: Shelllogout1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shelllogout1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shelllogout1(inputs);
      return vi_shelllogout1(inputs);
    }
  );
export { shelllogout1 as "shellLogout" };
