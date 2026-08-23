/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commonprevious1Inputs */

const vi_commonprevious1 =
  /** @type {(inputs: Commonprevious1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trước`;
  };

const en_commonprevious1 =
  /** @type {(inputs: Commonprevious1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Previous`;
  };

/**
 * | output |
 * | --- |
 * | "Previous" |
 *
 * @param {Commonprevious1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commonprevious1 =
  /** @type {((inputs?: Commonprevious1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commonprevious1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commonprevious1(inputs);
      return vi_commonprevious1(inputs);
    }
  );
export { commonprevious1 as "commonPrevious" };
