/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookgenericrotatebutton4Inputs */

const vi_leadswebhookgenericrotatebutton4 =
  /** @type {(inputs: Leadswebhookgenericrotatebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo lại (huỷ key cũ)`;
  };

const en_leadswebhookgenericrotatebutton4 =
  /** @type {(inputs: Leadswebhookgenericrotatebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Regenerate (revokes the old key)`;
  };

/**
 * | output |
 * | --- |
 * | "Regenerate (revokes the old key)" |
 *
 * @param {Leadswebhookgenericrotatebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookgenericrotatebutton4 =
  /** @type {((inputs?: Leadswebhookgenericrotatebutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookgenericrotatebutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookgenericrotatebutton4(inputs);
      return vi_leadswebhookgenericrotatebutton4(inputs);
    }
  );
export { leadswebhookgenericrotatebutton4 as "leadsWebhookGenericRotateButton" };
