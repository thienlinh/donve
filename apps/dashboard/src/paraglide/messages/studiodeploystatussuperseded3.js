/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodeploystatussuperseded3Inputs */

const vi_studiodeploystatussuperseded3 =
  /** @type {(inputs: Studiodeploystatussuperseded3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Từng live`;
  };

const en_studiodeploystatussuperseded3 =
  /** @type {(inputs: Studiodeploystatussuperseded3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Previously live`;
  };

/**
 * | output |
 * | --- |
 * | "Previously live" |
 *
 * @param {Studiodeploystatussuperseded3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodeploystatussuperseded3 =
  /** @type {((inputs?: Studiodeploystatussuperseded3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodeploystatussuperseded3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodeploystatussuperseded3(inputs);
      return vi_studiodeploystatussuperseded3(inputs);
    }
  );
export { studiodeploystatussuperseded3 as "studioDeployStatusSuperseded" };
