/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsorderreasontitle3Inputs */

const vi_leadsorderreasontitle3 =
  /** @type {(inputs: Leadsorderreasontitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lý do đổi trạng thái`;
  };

const en_leadsorderreasontitle3 =
  /** @type {(inputs: Leadsorderreasontitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Reason for status change`;
  };

/**
 * | output |
 * | --- |
 * | "Reason for status change" |
 *
 * @param {Leadsorderreasontitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsorderreasontitle3 =
  /** @type {((inputs?: Leadsorderreasontitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsorderreasontitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsorderreasontitle3(inputs);
      return vi_leadsorderreasontitle3(inputs);
    }
  );
export { leadsorderreasontitle3 as "leadsOrderReasonTitle" };
