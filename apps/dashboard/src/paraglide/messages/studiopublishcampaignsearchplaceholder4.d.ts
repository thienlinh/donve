export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishcampaignsearchplaceholder4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Search campaigns…" |
 *
 * @param {Studiopublishcampaignsearchplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishcampaignsearchplaceholder4: ((
  inputs?: Studiopublishcampaignsearchplaceholder4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishcampaignsearchplaceholder4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishcampaignsearchplaceholder4 as "studioPublishCampaignSearchPlaceholder" };
