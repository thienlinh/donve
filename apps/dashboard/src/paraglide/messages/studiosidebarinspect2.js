/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiosidebarinspect2Inputs */

const vi_studiosidebarinspect2 =
  /** @type {(inputs: Studiosidebarinspect2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Inspect`;
  };

const en_studiosidebarinspect2 =
  /** @type {(inputs: Studiosidebarinspect2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Inspect`;
  };

/**
 * | output |
 * | --- |
 * | "Inspect" |
 *
 * @param {Studiosidebarinspect2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiosidebarinspect2 =
  /** @type {((inputs?: Studiosidebarinspect2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiosidebarinspect2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiosidebarinspect2(inputs);
      return vi_studiosidebarinspect2(inputs);
    }
  );
export { studiosidebarinspect2 as "studioSidebarInspect" };
