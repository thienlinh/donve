/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookgenericrevokebutton4Inputs */

const vi_leadswebhookgenericrevokebutton4 =
  /** @type {(inputs: Leadswebhookgenericrevokebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thu hồi key (không dùng lại được)`;
  };

const en_leadswebhookgenericrevokebutton4 =
  /** @type {(inputs: Leadswebhookgenericrevokebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Revoke key (can't be reused)`;
  };

/**
 * | output |
 * | --- |
 * | "Revoke key (can't be reused)" |
 *
 * @param {Leadswebhookgenericrevokebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookgenericrevokebutton4 =
  /** @type {((inputs?: Leadswebhookgenericrevokebutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookgenericrevokebutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookgenericrevokebutton4(inputs);
      return vi_leadswebhookgenericrevokebutton4(inputs);
    }
  );
export { leadswebhookgenericrevokebutton4 as "leadsWebhookGenericRevokeButton" };
