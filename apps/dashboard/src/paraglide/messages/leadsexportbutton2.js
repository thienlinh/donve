/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsexportbutton2Inputs */

const vi_leadsexportbutton2 =
  /** @type {(inputs: Leadsexportbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất CSV`;
  };

const en_leadsexportbutton2 =
  /** @type {(inputs: Leadsexportbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Export CSV`;
  };

/**
 * | output |
 * | --- |
 * | "Export CSV" |
 *
 * @param {Leadsexportbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsexportbutton2 =
  /** @type {((inputs?: Leadsexportbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsexportbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsexportbutton2(inputs);
      return vi_leadsexportbutton2(inputs);
    }
  );
export { leadsexportbutton2 as "leadsExportButton" };
