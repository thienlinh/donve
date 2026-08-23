export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookverifytokenlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Verify token (Facebook only)" |
 *
 * @param {Leadswebhookverifytokenlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookverifytokenlabel4: ((
  inputs?: Leadswebhookverifytokenlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookverifytokenlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookverifytokenlabel4 as "leadsWebhookVerifyTokenLabel" };
