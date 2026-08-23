/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesgroupimages3Inputs */

const vi_studiofilesgroupimages3 =
  /** @type {(inputs: Studiofilesgroupimages3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `IMAGES`;
  };

const en_studiofilesgroupimages3 =
  /** @type {(inputs: Studiofilesgroupimages3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `IMAGES`;
  };

/**
 * | output |
 * | --- |
 * | "IMAGES" |
 *
 * @param {Studiofilesgroupimages3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesgroupimages3 =
  /** @type {((inputs?: Studiofilesgroupimages3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesgroupimages3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesgroupimages3(inputs);
      return vi_studiofilesgroupimages3(inputs);
    }
  );
export { studiofilesgroupimages3 as "studioFilesGroupImages" };
