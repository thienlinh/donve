/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillcontentlabel2Inputs */

const vi_skillcontentlabel2 =
  /** @type {(inputs: Skillcontentlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nội dung (Markdown)`;
  };

const en_skillcontentlabel2 =
  /** @type {(inputs: Skillcontentlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Content (Markdown)`;
  };

/**
 * | output |
 * | --- |
 * | "Content (Markdown)" |
 *
 * @param {Skillcontentlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillcontentlabel2 =
  /** @type {((inputs?: Skillcontentlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillcontentlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillcontentlabel2(inputs);
      return vi_skillcontentlabel2(inputs);
    }
  );
export { skillcontentlabel2 as "skillContentLabel" };
