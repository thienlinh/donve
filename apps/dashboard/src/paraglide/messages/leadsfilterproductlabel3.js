/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterproductlabel3Inputs */

const vi_leadsfilterproductlabel3 =
  /** @type {(inputs: Leadsfilterproductlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sản phẩm`;
  };

const en_leadsfilterproductlabel3 =
  /** @type {(inputs: Leadsfilterproductlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Product`;
  };

/**
 * | output |
 * | --- |
 * | "Product" |
 *
 * @param {Leadsfilterproductlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterproductlabel3 =
  /** @type {((inputs?: Leadsfilterproductlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterproductlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterproductlabel3(inputs);
      return vi_leadsfilterproductlabel3(inputs);
    }
  );
export { leadsfilterproductlabel3 as "leadsFilterProductLabel" };
