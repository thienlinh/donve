/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadscolumncreatedat3Inputs */

const vi_leadscolumncreatedat3 =
  /** @type {(inputs: Leadscolumncreatedat3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ngày tạo`;
  };

const en_leadscolumncreatedat3 =
  /** @type {(inputs: Leadscolumncreatedat3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Created`;
  };

/**
 * | output |
 * | --- |
 * | "Created" |
 *
 * @param {Leadscolumncreatedat3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadscolumncreatedat3 =
  /** @type {((inputs?: Leadscolumncreatedat3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadscolumncreatedat3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadscolumncreatedat3(inputs);
      return vi_leadscolumncreatedat3(inputs);
    }
  );
export { leadscolumncreatedat3 as "leadsColumnCreatedAt" };
