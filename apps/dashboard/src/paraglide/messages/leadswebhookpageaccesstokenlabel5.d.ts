export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookpageaccesstokenlabel5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Page Access Token" |
 *
 * @param {Leadswebhookpageaccesstokenlabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookpageaccesstokenlabel5: ((
  inputs?: Leadswebhookpageaccesstokenlabel5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookpageaccesstokenlabel5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookpageaccesstokenlabel5 as "leadsWebhookPageAccessTokenLabel" };
