/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodesignfilesemptydescription4Inputs */

const vi_studiodesignfilesemptydescription4 =
  /** @type {(inputs: Studiodesignfilesemptydescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cây file (folders, pages, data, images) sẽ làm ở prompt kế tiếp.`;
  };

const en_studiodesignfilesemptydescription4 =
  /** @type {(inputs: Studiodesignfilesemptydescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `The file tree (folders, pages, data, images) lands in a follow-up pass.`;
  };

/**
 * | output |
 * | --- |
 * | "The file tree (folders, pages, data, images) lands in a follow-up pass." |
 *
 * @param {Studiodesignfilesemptydescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodesignfilesemptydescription4 =
  /** @type {((inputs?: Studiodesignfilesemptydescription4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodesignfilesemptydescription4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodesignfilesemptydescription4(inputs);
      return vi_studiodesignfilesemptydescription4(inputs);
    }
  );
export { studiodesignfilesemptydescription4 as "studioDesignFilesEmptyDescription" };
