/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ time: NonNullable<unknown> }} Studioautosavesaved2Inputs */

const vi_studioautosavesaved2 =
  /** @type {(inputs: Studioautosavesaved2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã lưu ${i?.time}`;
  };

const en_studioautosavesaved2 =
  /** @type {(inputs: Studioautosavesaved2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Saved ${i?.time}`;
  };

/**
 * | output |
 * | --- |
 * | "Saved {time}" |
 *
 * @param {Studioautosavesaved2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioautosavesaved2 =
  /** @type {((inputs: Studioautosavesaved2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioautosavesaved2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioautosavesaved2(inputs);
      return vi_studioautosavesaved2(inputs);
    }
  );
export { studioautosavesaved2 as "studioAutosaveSaved" };
