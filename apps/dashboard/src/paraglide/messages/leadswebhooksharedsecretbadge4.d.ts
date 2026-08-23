export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooksharedsecretbadge4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Using shared secret" |
 *
 * @param {Leadswebhooksharedsecretbadge4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooksharedsecretbadge4: ((
  inputs?: Leadswebhooksharedsecretbadge4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooksharedsecretbadge4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooksharedsecretbadge4 as "leadsWebhookSharedSecretBadge" };
