/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellmembersnav2Inputs */

const vi_shellmembersnav2 =
  /** @type {(inputs: Shellmembersnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thành viên`;
  };

const en_shellmembersnav2 =
  /** @type {(inputs: Shellmembersnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Members`;
  };

/**
 * | output |
 * | --- |
 * | "Members" |
 *
 * @param {Shellmembersnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellmembersnav2 =
  /** @type {((inputs?: Shellmembersnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellmembersnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellmembersnav2(inputs);
      return vi_shellmembersnav2(inputs);
    }
  );
export { shellmembersnav2 as "shellMembersNav" };
