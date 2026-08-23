export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooktiktokdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Click Connect and approve access on TikTok's own screen — no secret or token to copy anywhere, Donve handles the rest automatically." |
 *
 * @param {Leadswebhooktiktokdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooktiktokdescription3: ((
  inputs?: Leadswebhooktiktokdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooktiktokdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooktiktokdescription3 as "leadsWebhookTiktokDescription" };
