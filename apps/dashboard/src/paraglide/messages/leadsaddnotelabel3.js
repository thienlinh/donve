/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsaddnotelabel3Inputs */

const vi_leadsaddnotelabel3 =
  /** @type {(inputs: Leadsaddnotelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm ghi chú`;
  };

const en_leadsaddnotelabel3 =
  /** @type {(inputs: Leadsaddnotelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add a note`;
  };

/**
 * | output |
 * | --- |
 * | "Add a note" |
 *
 * @param {Leadsaddnotelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsaddnotelabel3 =
  /** @type {((inputs?: Leadsaddnotelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsaddnotelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsaddnotelabel3(inputs);
      return vi_leadsaddnotelabel3(inputs);
    }
  );
export { leadsaddnotelabel3 as "leadsAddNoteLabel" };
