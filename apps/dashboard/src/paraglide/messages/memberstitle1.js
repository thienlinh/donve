/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberstitle1Inputs */

const vi_memberstitle1 =
  /** @type {(inputs: Memberstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thành viên`;
  };

const en_memberstitle1 =
  /** @type {(inputs: Memberstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Members`;
  };

/**
 * | output |
 * | --- |
 * | "Members" |
 *
 * @param {Memberstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberstitle1 =
  /** @type {((inputs?: Memberstitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberstitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberstitle1(inputs);
      return vi_memberstitle1(inputs);
    }
  );
export { memberstitle1 as "membersTitle" };
