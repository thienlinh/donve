export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishcampaignattachedtoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Campaign attached" |
 *
 * @param {Studiopublishcampaignattachedtoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishcampaignattachedtoast4: ((
  inputs?: Studiopublishcampaignattachedtoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishcampaignattachedtoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishcampaignattachedtoast4 as "studioPublishCampaignAttachedToast" };
