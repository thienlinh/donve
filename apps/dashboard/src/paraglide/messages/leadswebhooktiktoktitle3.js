/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooktiktoktitle3Inputs */

const vi_leadswebhooktiktoktitle3 =
  /** @type {(inputs: Leadswebhooktiktoktitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `TikTok Lead Generation`;
  };

const en_leadswebhooktiktoktitle3 =
  /** @type {(inputs: Leadswebhooktiktoktitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `TikTok Lead Generation`;
  };

/**
 * | output |
 * | --- |
 * | "TikTok Lead Generation" |
 *
 * @param {Leadswebhooktiktoktitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooktiktoktitle3 =
  /** @type {((inputs?: Leadswebhooktiktoktitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooktiktoktitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooktiktoktitle3(inputs);
      return vi_leadswebhooktiktoktitle3(inputs);
    }
  );
export { leadswebhooktiktoktitle3 as "leadsWebhookTiktokTitle" };
