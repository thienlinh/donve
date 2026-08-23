/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersseeallleadserrortoast5Inputs */

const vi_membersseeallleadserrortoast5 =
  /** @type {(inputs: Membersseeallleadserrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cập nhật quyền xem lead thất bại`;
  };

const en_membersseeallleadserrortoast5 =
  /** @type {(inputs: Membersseeallleadserrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to update lead visibility`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to update lead visibility" |
 *
 * @param {Membersseeallleadserrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersseeallleadserrortoast5 =
  /** @type {((inputs?: Membersseeallleadserrortoast5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersseeallleadserrortoast5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersseeallleadserrortoast5(inputs);
      return vi_membersseeallleadserrortoast5(inputs);
    }
  );
export { membersseeallleadserrortoast5 as "membersSeeAllLeadsErrorToast" };
