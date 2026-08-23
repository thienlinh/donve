/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookgenerickeyrevealedwarning5Inputs */

const vi_leadswebhookgenerickeyrevealedwarning5 =
  /** @type {(inputs: Leadswebhookgenerickeyrevealedwarning5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Copy ngay — Donve sẽ không hiển thị lại key này sau khi bạn rời trang.`;
  };

const en_leadswebhookgenerickeyrevealedwarning5 =
  /** @type {(inputs: Leadswebhookgenerickeyrevealedwarning5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Copy it now — Donve won't show this key again after you leave this page.`;
  };

/**
 * | output |
 * | --- |
 * | "Copy it now — Donve won't show this key again after you leave this page." |
 *
 * @param {Leadswebhookgenerickeyrevealedwarning5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookgenerickeyrevealedwarning5 =
  /** @type {((inputs?: Leadswebhookgenerickeyrevealedwarning5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookgenerickeyrevealedwarning5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadswebhookgenerickeyrevealedwarning5(inputs);
      return vi_leadswebhookgenerickeyrevealedwarning5(inputs);
    }
  );
export { leadswebhookgenerickeyrevealedwarning5 as "leadsWebhookGenericKeyRevealedWarning" };
