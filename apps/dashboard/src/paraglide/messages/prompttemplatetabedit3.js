/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatetabedit3Inputs */

const vi_prompttemplatetabedit3 =
  /** @type {(inputs: Prompttemplatetabedit3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chỉnh sửa`;
  };

const en_prompttemplatetabedit3 =
  /** @type {(inputs: Prompttemplatetabedit3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Edit`;
  };

/**
 * | output |
 * | --- |
 * | "Edit" |
 *
 * @param {Prompttemplatetabedit3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatetabedit3 =
  /** @type {((inputs?: Prompttemplatetabedit3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatetabedit3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatetabedit3(inputs);
      return vi_prompttemplatetabedit3(inputs);
    }
  );
export { prompttemplatetabedit3 as "promptTemplateTabEdit" };
