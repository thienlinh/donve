export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookverifytokenplaceholder4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Token Facebook uses to verify the webhook URL" |
 *
 * @param {Leadswebhookverifytokenplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookverifytokenplaceholder4: ((
  inputs?: Leadswebhookverifytokenplaceholder4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookverifytokenplaceholder4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookverifytokenplaceholder4 as "leadsWebhookVerifyTokenPlaceholder" };
