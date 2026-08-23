/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateconnectiontrial3Inputs */

const vi_prompttemplateconnectiontrial3 =
  /** @type {(inputs: Prompttemplateconnectiontrial3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dùng thử`;
  };

const en_prompttemplateconnectiontrial3 =
  /** @type {(inputs: Prompttemplateconnectiontrial3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trial`;
  };

/**
 * | output |
 * | --- |
 * | "Trial" |
 *
 * @param {Prompttemplateconnectiontrial3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateconnectiontrial3 =
  /** @type {((inputs?: Prompttemplateconnectiontrial3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateconnectiontrial3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateconnectiontrial3(inputs);
      return vi_prompttemplateconnectiontrial3(inputs);
    }
  );
export { prompttemplateconnectiontrial3 as "promptTemplateConnectionTrial" };
