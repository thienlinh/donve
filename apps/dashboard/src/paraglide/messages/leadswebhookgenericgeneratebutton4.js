/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookgenericgeneratebutton4Inputs */

const vi_leadswebhookgenericgeneratebutton4 =
  /** @type {(inputs: Leadswebhookgenericgeneratebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo API Key`;
  };

const en_leadswebhookgenericgeneratebutton4 =
  /** @type {(inputs: Leadswebhookgenericgeneratebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Generate API Key`;
  };

/**
 * | output |
 * | --- |
 * | "Generate API Key" |
 *
 * @param {Leadswebhookgenericgeneratebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookgenericgeneratebutton4 =
  /** @type {((inputs?: Leadswebhookgenericgeneratebutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookgenericgeneratebutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookgenericgeneratebutton4(inputs);
      return vi_leadswebhookgenericgeneratebutton4(inputs);
    }
  );
export { leadswebhookgenericgeneratebutton4 as "leadsWebhookGenericGenerateButton" };
