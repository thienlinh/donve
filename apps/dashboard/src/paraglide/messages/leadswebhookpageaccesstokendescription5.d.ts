export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookpageaccesstokendescription5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Required to fetch real form data from Facebook — the webhook only announces a new lead (leadgen_id), this token is what lets us call back into the Graph API ..." |
 *
 * @param {Leadswebhookpageaccesstokendescription5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookpageaccesstokendescription5: ((
  inputs?: Leadswebhookpageaccesstokendescription5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookpageaccesstokendescription5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookpageaccesstokendescription5 as "leadsWebhookPageAccessTokenDescription" };
