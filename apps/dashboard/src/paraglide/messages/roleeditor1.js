/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roleeditor1Inputs */

const vi_roleeditor1 =
  /** @type {(inputs: Roleeditor1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Biên tập viên`;
  };

const en_roleeditor1 =
  /** @type {(inputs: Roleeditor1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Editor`;
  };

/**
 * | output |
 * | --- |
 * | "Editor" |
 *
 * @param {Roleeditor1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const roleeditor1 =
  /** @type {((inputs?: Roleeditor1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roleeditor1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_roleeditor1(inputs);
      return vi_roleeditor1(inputs);
    }
  );
export { roleeditor1 as "roleEditor" };
