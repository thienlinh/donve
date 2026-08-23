export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsremoveconfirmtitle3Inputs = {
  name: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Remove {name}?" |
 *
 * @param {Campaignsremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsremoveconfirmtitle3: ((
  inputs: Campaignsremoveconfirmtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsremoveconfirmtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsremoveconfirmtitle3 as "campaignsRemoveConfirmTitle" };
