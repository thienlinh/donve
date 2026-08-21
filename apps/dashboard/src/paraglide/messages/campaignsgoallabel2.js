/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsgoallabel2Inputs */

const vi_campaignsgoallabel2 =
  /** @type {(inputs: Campaignsgoallabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mục tiêu`;
  };

const en_campaignsgoallabel2 =
  /** @type {(inputs: Campaignsgoallabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Goal`;
  };

/**
 * | output |
 * | --- |
 * | "Goal" |
 *
 * @param {Campaignsgoallabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsgoallabel2 =
  /** @type {((inputs?: Campaignsgoallabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsgoallabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsgoallabel2(inputs);
      return vi_campaignsgoallabel2(inputs);
    }
  );
export { campaignsgoallabel2 as "campaignsGoalLabel" };
