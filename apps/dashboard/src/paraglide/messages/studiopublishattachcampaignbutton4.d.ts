export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishattachcampaignbutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Attach" |
 *
 * @param {Studiopublishattachcampaignbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishattachcampaignbutton4: ((
  inputs?: Studiopublishattachcampaignbutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishattachcampaignbutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishattachcampaignbutton4 as "studioPublishAttachCampaignButton" };
