/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersrolelabel2Inputs */

const vi_membersrolelabel2 =
  /** @type {(inputs: Membersrolelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Vai trò`;
  };

const en_membersrolelabel2 =
  /** @type {(inputs: Membersrolelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Role`;
  };

/**
 * | output |
 * | --- |
 * | "Role" |
 *
 * @param {Membersrolelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersrolelabel2 =
  /** @type {((inputs?: Membersrolelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersrolelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersrolelabel2(inputs);
      return vi_membersrolelabel2(inputs);
    }
  );
export { membersrolelabel2 as "membersRoleLabel" };
