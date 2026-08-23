/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooksaveerrortoast4Inputs */

const vi_leadswebhooksaveerrortoast4 =
  /** @type {(inputs: Leadswebhooksaveerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu webhook thất bại`;
  };

const en_leadswebhooksaveerrortoast4 =
  /** @type {(inputs: Leadswebhooksaveerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to save webhook`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to save webhook" |
 *
 * @param {Leadswebhooksaveerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooksaveerrortoast4 =
  /** @type {((inputs?: Leadswebhooksaveerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooksaveerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooksaveerrortoast4(inputs);
      return vi_leadswebhooksaveerrortoast4(inputs);
    }
  );
export { leadswebhooksaveerrortoast4 as "leadsWebhookSaveErrorToast" };
