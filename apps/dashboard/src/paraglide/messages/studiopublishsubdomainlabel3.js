/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishsubdomainlabel3Inputs */

const vi_studiopublishsubdomainlabel3 =
  /** @type {(inputs: Studiopublishsubdomainlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Subdomain`;
  };

const en_studiopublishsubdomainlabel3 =
  /** @type {(inputs: Studiopublishsubdomainlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Subdomain`;
  };

/**
 * | output |
 * | --- |
 * | "Subdomain" |
 *
 * @param {Studiopublishsubdomainlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishsubdomainlabel3 =
  /** @type {((inputs?: Studiopublishsubdomainlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishsubdomainlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishsubdomainlabel3(inputs);
      return vi_studiopublishsubdomainlabel3(inputs);
    }
  );
export { studiopublishsubdomainlabel3 as "studioPublishSubdomainLabel" };
