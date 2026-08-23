export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooktiktoktitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "TikTok Lead Generation" |
 *
 * @param {Leadswebhooktiktoktitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooktiktoktitle3: ((
  inputs?: Leadswebhooktiktoktitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooktiktoktitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooktiktoktitle3 as "leadsWebhookTiktokTitle" };
