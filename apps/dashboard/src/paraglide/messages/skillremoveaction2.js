/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillremoveaction2Inputs */

const vi_skillremoveaction2 =
  /** @type {(inputs: Skillremoveaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa kỹ năng`;
  };

const en_skillremoveaction2 =
  /** @type {(inputs: Skillremoveaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove skill`;
  };

/**
 * | output |
 * | --- |
 * | "Remove skill" |
 *
 * @param {Skillremoveaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillremoveaction2 =
  /** @type {((inputs?: Skillremoveaction2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillremoveaction2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillremoveaction2(inputs);
      return vi_skillremoveaction2(inputs);
    }
  );
export { skillremoveaction2 as "skillRemoveAction" };
