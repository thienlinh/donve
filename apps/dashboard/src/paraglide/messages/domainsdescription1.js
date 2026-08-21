/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsdescription1Inputs */

const vi_domainsdescription1 =
  /** @type {(inputs: Domainsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trỏ tên miền của bạn vào một trang landing đã publish — CNAME và chứng chỉ SSL được tự động cấp qua Cloudflare for SaaS.`;
  };

const en_domainsdescription1 =
  /** @type {(inputs: Domainsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Point your own domain at a published landing page — CNAME + SSL certificate are handled automatically via Cloudflare for SaaS.`;
  };

/**
 * | output |
 * | --- |
 * | "Point your own domain at a published landing page — CNAME + SSL certificate are handled automatically via Cloudflare for SaaS." |
 *
 * @param {Domainsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsdescription1 =
  /** @type {((inputs?: Domainsdescription1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsdescription1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsdescription1(inputs);
      return vi_domainsdescription1(inputs);
    }
  );
export { domainsdescription1 as "domainsDescription" };
