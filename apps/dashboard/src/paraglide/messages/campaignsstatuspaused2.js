/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsstatuspaused2Inputs */

const vi_campaignsstatuspaused2 =
  /** @type {(inputs: Campaignsstatuspaused2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạm dừng`;
  };

const en_campaignsstatuspaused2 =
  /** @type {(inputs: Campaignsstatuspaused2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paused`;
  };

/**
 * | output |
 * | --- |
 * | "Paused" |
 *
 * @param {Campaignsstatuspaused2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsstatuspaused2 =
  /** @type {((inputs?: Campaignsstatuspaused2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsstatuspaused2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsstatuspaused2(inputs);
      return vi_campaignsstatuspaused2(inputs);
    }
  );
export { campaignsstatuspaused2 as "campaignsStatusPaused" };
