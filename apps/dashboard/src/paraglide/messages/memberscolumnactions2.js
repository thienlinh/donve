/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberscolumnactions2Inputs */

const vi_memberscolumnactions2 =
  /** @type {(inputs: Memberscolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thao tác`;
  };

const en_memberscolumnactions2 =
  /** @type {(inputs: Memberscolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Actions`;
  };

/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Memberscolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberscolumnactions2 =
  /** @type {((inputs?: Memberscolumnactions2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberscolumnactions2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberscolumnactions2(inputs);
      return vi_memberscolumnactions2(inputs);
    }
  );
export { memberscolumnactions2 as "membersColumnActions" };
