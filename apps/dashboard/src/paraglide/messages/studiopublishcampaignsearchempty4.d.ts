export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishcampaignsearchempty4Inputs = {};
/**
 * | output |
 * | --- |
 * | "No campaigns found." |
 *
 * @param {Studiopublishcampaignsearchempty4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishcampaignsearchempty4: ((
  inputs?: Studiopublishcampaignsearchempty4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishcampaignsearchempty4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishcampaignsearchempty4 as "studioPublishCampaignSearchEmpty" };
