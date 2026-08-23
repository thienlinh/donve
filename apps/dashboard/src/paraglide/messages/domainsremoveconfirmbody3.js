/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsremoveconfirmbody3Inputs */

const vi_domainsremoveconfirmbody3 =
  /** @type {(inputs: Domainsremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên miền sẽ ngừng phục vụ trang landing của bạn ngay lập tức.`;
  };

const en_domainsremoveconfirmbody3 =
  /** @type {(inputs: Domainsremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `The domain will stop serving your landing page immediately.`;
  };

/**
 * | output |
 * | --- |
 * | "The domain will stop serving your landing page immediately." |
 *
 * @param {Domainsremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsremoveconfirmbody3 =
  /** @type {((inputs?: Domainsremoveconfirmbody3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsremoveconfirmbody3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsremoveconfirmbody3(inputs);
      return vi_domainsremoveconfirmbody3(inputs);
    }
  );
export { domainsremoveconfirmbody3 as "domainsRemoveConfirmBody" };
