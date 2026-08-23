/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ fileName: NonNullable<unknown> }} Studiofilesjsonviewertitle4Inputs */

const vi_studiofilesjsonviewertitle4 =
  /** @type {(inputs: Studiofilesjsonviewertitle4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.fileName} — chỉ xem`;
  };

const en_studiofilesjsonviewertitle4 =
  /** @type {(inputs: Studiofilesjsonviewertitle4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.fileName} — read-only`;
  };

/**
 * | output |
 * | --- |
 * | "{fileName} — read-only" |
 *
 * @param {Studiofilesjsonviewertitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesjsonviewertitle4 =
  /** @type {((inputs: Studiofilesjsonviewertitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesjsonviewertitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesjsonviewertitle4(inputs);
      return vi_studiofilesjsonviewertitle4(inputs);
    }
  );
export { studiofilesjsonviewertitle4 as "studioFilesJsonViewerTitle" };
