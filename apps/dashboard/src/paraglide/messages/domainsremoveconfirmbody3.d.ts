export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsremoveconfirmbody3Inputs = {};
/**
 * | output |
 * | --- |
 * | "The domain will stop serving your landing page immediately." |
 *
 * @param {Domainsremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsremoveconfirmbody3: ((
  inputs?: Domainsremoveconfirmbody3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsremoveconfirmbody3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsremoveconfirmbody3 as "domainsRemoveConfirmBody" };
