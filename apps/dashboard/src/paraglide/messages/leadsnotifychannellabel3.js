/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifychannellabel3Inputs */

const vi_leadsnotifychannellabel3 =
  /** @type {(inputs: Leadsnotifychannellabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kênh`;
  };

const en_leadsnotifychannellabel3 =
  /** @type {(inputs: Leadsnotifychannellabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Channel`;
  };

/**
 * | output |
 * | --- |
 * | "Channel" |
 *
 * @param {Leadsnotifychannellabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifychannellabel3 =
  /** @type {((inputs?: Leadsnotifychannellabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifychannellabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifychannellabel3(inputs);
      return vi_leadsnotifychannellabel3(inputs);
    }
  );
export { leadsnotifychannellabel3 as "leadsNotifyChannelLabel" };
