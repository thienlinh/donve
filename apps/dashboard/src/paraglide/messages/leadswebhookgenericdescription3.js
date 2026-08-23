/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookgenericdescription3Inputs */

const vi_leadswebhookgenericdescription3 =
  /** @type {(inputs: Leadswebhookgenericdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dùng cho bất kỳ nguồn lead nào chưa có tích hợp riêng ở trên (server cầu nối Zalo Mini App, CRM riêng, công cụ tự động hoá...). Xác thực bằng 1 API Key thay vì chữ ký — dán key vào header Authorization: Bearer <key>.`;
  };

const en_leadswebhookgenericdescription3 =
  /** @type {(inputs: Leadswebhookgenericdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Use for any lead source with no dedicated integration above (a Zalo Mini App bridge server, a custom CRM, an automation tool...). Authenticated by a plain API key instead of a signature — paste it into the Authorization: Bearer <key> header.`;
  };

/**
 * | output |
 * | --- |
 * | "Use for any lead source with no dedicated integration above (a Zalo Mini App bridge server, a custom CRM, an automation tool...). Authenticated by a plain AP..." |
 *
 * @param {Leadswebhookgenericdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookgenericdescription3 =
  /** @type {((inputs?: Leadswebhookgenericdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookgenericdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookgenericdescription3(inputs);
      return vi_leadswebhookgenericdescription3(inputs);
    }
  );
export { leadswebhookgenericdescription3 as "leadsWebhookGenericDescription" };
