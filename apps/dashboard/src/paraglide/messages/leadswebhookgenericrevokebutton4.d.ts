export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookgenericrevokebutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Revoke key (can't be reused)" |
 *
 * @param {Leadswebhookgenericrevokebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookgenericrevokebutton4: ((
  inputs?: Leadswebhookgenericrevokebutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookgenericrevokebutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookgenericrevokebutton4 as "leadsWebhookGenericRevokeButton" };
