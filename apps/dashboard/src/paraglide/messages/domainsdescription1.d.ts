export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsdescription1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Point your own domain at a published landing page — CNAME + SSL certificate are handled automatically via Cloudflare for SaaS." |
 *
 * @param {Domainsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsdescription1: ((
  inputs?: Domainsdescription1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsdescription1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsdescription1 as "domainsDescription" };
