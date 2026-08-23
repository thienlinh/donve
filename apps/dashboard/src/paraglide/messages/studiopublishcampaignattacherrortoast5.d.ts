export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishcampaignattacherrortoast5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't attach campaign. Try again." |
 *
 * @param {Studiopublishcampaignattacherrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishcampaignattacherrortoast5: ((
  inputs?: Studiopublishcampaignattacherrortoast5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishcampaignattacherrortoast5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishcampaignattacherrortoast5 as "studioPublishCampaignAttachErrorToast" };
