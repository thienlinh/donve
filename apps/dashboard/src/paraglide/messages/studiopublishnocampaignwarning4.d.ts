export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishnocampaignwarning4Inputs = {};
/**
 * | output |
 * | --- |
 * | "This page has a signup form, but isn't linked to a campaign yet. Without one, the form has no fields, no payment setup, and nothing to submit into. Attach a ..." |
 *
 * @param {Studiopublishnocampaignwarning4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishnocampaignwarning4: ((
  inputs?: Studiopublishnocampaignwarning4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishnocampaignwarning4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishnocampaignwarning4 as "studioPublishNoCampaignWarning" };
