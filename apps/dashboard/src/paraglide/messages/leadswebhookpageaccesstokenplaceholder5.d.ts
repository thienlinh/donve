export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookpageaccesstokenplaceholder5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste the Page Access Token from Graph API Explorer" |
 *
 * @param {Leadswebhookpageaccesstokenplaceholder5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookpageaccesstokenplaceholder5: ((
  inputs?: Leadswebhookpageaccesstokenplaceholder5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookpageaccesstokenplaceholder5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookpageaccesstokenplaceholder5 as "leadsWebhookPageAccessTokenPlaceholder" };
