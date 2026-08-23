/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesgroupdata3Inputs */

const vi_studiofilesgroupdata3 =
  /** @type {(inputs: Studiofilesgroupdata3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `DATA`;
  };

const en_studiofilesgroupdata3 =
  /** @type {(inputs: Studiofilesgroupdata3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `DATA`;
  };

/**
 * | output |
 * | --- |
 * | "DATA" |
 *
 * @param {Studiofilesgroupdata3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesgroupdata3 =
  /** @type {((inputs?: Studiofilesgroupdata3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesgroupdata3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesgroupdata3(inputs);
      return vi_studiofilesgroupdata3(inputs);
    }
  );
export { studiofilesgroupdata3 as "studioFilesGroupData" };
