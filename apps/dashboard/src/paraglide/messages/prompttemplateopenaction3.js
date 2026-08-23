/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateopenaction3Inputs */

const vi_prompttemplateopenaction3 =
  /** @type {(inputs: Prompttemplateopenaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mở`;
  };

const en_prompttemplateopenaction3 =
  /** @type {(inputs: Prompttemplateopenaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Open`;
  };

/**
 * | output |
 * | --- |
 * | "Open" |
 *
 * @param {Prompttemplateopenaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateopenaction3 =
  /** @type {((inputs?: Prompttemplateopenaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateopenaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateopenaction3(inputs);
      return vi_prompttemplateopenaction3(inputs);
    }
  );
export { prompttemplateopenaction3 as "promptTemplateOpenAction" };
