/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiosidebarlayers2Inputs */

const vi_studiosidebarlayers2 =
  /** @type {(inputs: Studiosidebarlayers2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Layers`;
  };

const en_studiosidebarlayers2 =
  /** @type {(inputs: Studiosidebarlayers2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Layers`;
  };

/**
 * | output |
 * | --- |
 * | "Layers" |
 *
 * @param {Studiosidebarlayers2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiosidebarlayers2 =
  /** @type {((inputs?: Studiosidebarlayers2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiosidebarlayers2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiosidebarlayers2(inputs);
      return vi_studiosidebarlayers2(inputs);
    }
  );
export { studiosidebarlayers2 as "studioSidebarLayers" };
