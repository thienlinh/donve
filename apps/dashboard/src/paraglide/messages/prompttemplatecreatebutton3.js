/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecreatebutton3Inputs */

const vi_prompttemplatecreatebutton3 =
  /** @type {(inputs: Prompttemplatecreatebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo mẫu prompt`;
  };

const en_prompttemplatecreatebutton3 =
  /** @type {(inputs: Prompttemplatecreatebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `New template`;
  };

/**
 * | output |
 * | --- |
 * | "New template" |
 *
 * @param {Prompttemplatecreatebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecreatebutton3 =
  /** @type {((inputs?: Prompttemplatecreatebutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecreatebutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatecreatebutton3(inputs);
      return vi_prompttemplatecreatebutton3(inputs);
    }
  );
export { prompttemplatecreatebutton3 as "promptTemplateCreateButton" };
