/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportbutton2Inputs */

const vi_leadsimportbutton2 =
  /** @type {(inputs: Leadsimportbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhập CSV`;
  };

const en_leadsimportbutton2 =
  /** @type {(inputs: Leadsimportbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Import CSV`;
  };

/**
 * | output |
 * | --- |
 * | "Import CSV" |
 *
 * @param {Leadsimportbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportbutton2 =
  /** @type {((inputs?: Leadsimportbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportbutton2(inputs);
      return vi_leadsimportbutton2(inputs);
    }
  );
export { leadsimportbutton2 as "leadsImportButton" };
