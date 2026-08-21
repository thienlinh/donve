export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsremoveconfirmtitle3Inputs = {
  hostname: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Remove {hostname}?" |
 *
 * @param {Domainsremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsremoveconfirmtitle3: ((
  inputs: Domainsremoveconfirmtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsremoveconfirmtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsremoveconfirmtitle3 as "domainsRemoveConfirmTitle" };
