export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyznsaccesstokenlabel5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Access token" |
 *
 * @param {Leadsnotifyznsaccesstokenlabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyznsaccesstokenlabel5: ((
  inputs?: Leadsnotifyznsaccesstokenlabel5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyznsaccesstokenlabel5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyznsaccesstokenlabel5 as "leadsNotifyZnsAccessTokenLabel" };
