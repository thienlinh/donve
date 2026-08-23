/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiogenerateerrornoaiconnectiontitle6Inputs */

const vi_studiogenerateerrornoaiconnectiontitle6 =
  /** @type {(inputs: Studiogenerateerrornoaiconnectiontitle6Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa kết nối AI`;
  };

const en_studiogenerateerrornoaiconnectiontitle6 =
  /** @type {(inputs: Studiogenerateerrornoaiconnectiontitle6Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No AI connection set up`;
  };

/**
 * | output |
 * | --- |
 * | "No AI connection set up" |
 *
 * @param {Studiogenerateerrornoaiconnectiontitle6Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiogenerateerrornoaiconnectiontitle6 =
  /** @type {((inputs?: Studiogenerateerrornoaiconnectiontitle6Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiogenerateerrornoaiconnectiontitle6Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiogenerateerrornoaiconnectiontitle6(inputs);
      return vi_studiogenerateerrornoaiconnectiontitle6(inputs);
    }
  );
export { studiogenerateerrornoaiconnectiontitle6 as "studioGenerateErrorNoAiConnectionTitle" };
