/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooktiktokdescription3Inputs */

const vi_leadswebhooktiktokdescription3 =
  /** @type {(inputs: Leadswebhooktiktokdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bấm Kết nối và đồng ý ngay trên màn hình của TikTok — không cần copy secret hay token nào cả, Donve tự lo phần còn lại.`;
  };

const en_leadswebhooktiktokdescription3 =
  /** @type {(inputs: Leadswebhooktiktokdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Click Connect and approve access on TikTok's own screen — no secret or token to copy anywhere, Donve handles the rest automatically.`;
  };

/**
 * | output |
 * | --- |
 * | "Click Connect and approve access on TikTok's own screen — no secret or token to copy anywhere, Donve handles the rest automatically." |
 *
 * @param {Leadswebhooktiktokdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooktiktokdescription3 =
  /** @type {((inputs?: Leadswebhooktiktokdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooktiktokdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooktiktokdescription3(inputs);
      return vi_leadswebhooktiktokdescription3(inputs);
    }
  );
export { leadswebhooktiktokdescription3 as "leadsWebhookTiktokDescription" };
