/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookcarddescription3Inputs */

const vi_leadswebhookcarddescription3 =
  /** @type {(inputs: Leadswebhookcarddescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Có secret riêng thì org này cô lập khỏi các org khác dùng chung 1 App trung tâm.`;
  };

const en_leadswebhookcarddescription3 =
  /** @type {(inputs: Leadswebhookcarddescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `A dedicated secret isolates this org from others sharing one central App.`;
  };

/**
 * | output |
 * | --- |
 * | "A dedicated secret isolates this org from others sharing one central App." |
 *
 * @param {Leadswebhookcarddescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookcarddescription3 =
  /** @type {((inputs?: Leadswebhookcarddescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookcarddescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookcarddescription3(inputs);
      return vi_leadswebhookcarddescription3(inputs);
    }
  );
export { leadswebhookcarddescription3 as "leadsWebhookCardDescription" };
